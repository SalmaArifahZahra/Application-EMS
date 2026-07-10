"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Papa from "papaparse";
import { formatDate } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/data-display/empty-state";
import { TableSkeleton } from "@/components/feedback/table-skeleton";
import { SearchInput } from "@/components/form/search-input";
import { Filter, Upload, Plus, MoreHorizontal, ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { employeeService } from "@/features/employee/services/employee-service";
import { DeleteEmployeeButton } from "@/features/employee/components/delete-employee-dialog";
import type { Employee } from "@/features/employee/types";
import { useAuth } from "@/features/auth/hooks/use-auth";

export function EmployeePage() {
  const router = useRouter();
  const { user, hasPermission } = useAuth();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filterDept, setFilterDept] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  async function loadEmployees() {
    try {
      setLoading(true);
      const data = await employeeService.getAll();
      
      if (hasPermission("employee.view")) {
        setEmployees(data);
      } else if (hasPermission("employee.view.self")) {
        setEmployees(data.filter(emp => emp.email === user?.email));
      } else {
        setEmployees([]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEmployees();
  }, []);

  let filteredEmployees = employees.filter((employee) => {
    const keyword = search.toLowerCase();
    const matchesSearch = (
      (employee.firstName + " " + employee.lastName).toLowerCase().includes(keyword) ||
      employee.email.toLowerCase().includes(keyword)
    );
    const matchesDept = filterDept ? employee.departmentCode === filterDept : true;
    const matchesStatus = filterStatus ? employee.status === filterStatus : true;
    
    return matchesSearch && matchesDept && matchesStatus;
  });

  if (sortOrder === "asc") {
    filteredEmployees = filteredEmployees.sort((a, b) => (a.firstName + " " + a.lastName).localeCompare(b.firstName + " " + b.lastName));
  } else if (sortOrder === "desc") {
    filteredEmployees = filteredEmployees.sort((a, b) => (b.firstName + " " + b.lastName).localeCompare(a.firstName + " " + a.lastName));
  }

  const uniqueDepartments = Array.from(new Set(employees.map(e => e.departmentCode)));

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const paginatedEmployees = filteredEmployees.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  function handleExportCSV() {
    const csv = Papa.unparse(employees);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "employees.csv");
    link.click();
  }

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 md:p-8 shadow-sm">
      
      {/* Search Bar placed at the top like in the reference image (though technically in header, we can place it here) */}
      <div className="mb-8 w-full md:max-w-md">
        <SearchInput
          value={search}
          onChange={(v) => { setSearch(v); setCurrentPage(1); }}
          placeholder="Search..."
        />
      </div>

      {/* Header & Actions */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Employees</h1>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>Showing</span>
            <select 
              value={itemsPerPage}
              onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
              className="bg-slate-100 rounded-md px-2 py-1 outline-none text-slate-700 font-medium"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
          
          <select
            value={filterDept}
            onChange={(e) => { setFilterDept(e.target.value); setCurrentPage(1); }}
            className="bg-slate-100 rounded-md px-2 py-1.5 outline-none text-slate-700 font-medium text-sm border-r-4 border-transparent"
          >
            <option value="">All Departments</option>
            {uniqueDepartments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
            className="bg-slate-100 rounded-md px-2 py-1.5 outline-none text-slate-700 font-medium text-sm border-r-4 border-transparent"
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => { setSortOrder(e.target.value); setCurrentPage(1); }}
            className="bg-slate-100 rounded-md px-2 py-1.5 outline-none text-slate-700 font-medium text-sm border-r-4 border-transparent"
          >
            <option value="">Sort by Name</option>
            <option value="asc">A - Z</option>
            <option value="desc">Z - A</option>
          </select>

          <Button variant="outline" onClick={handleExportCSV} className="gap-2 text-slate-600 rounded-lg border-slate-200">
            <Upload size={16} /> Export
          </Button>

          {hasPermission("employee.create") && (
            <Button onClick={() => router.push("/dashboard/employees/create")} className="bg-[#3B82F6] hover:bg-blue-600 text-white gap-2 rounded-lg px-4 shadow-sm">
              <Plus size={16} /> Add New Employee
            </Button>
          )}
        </div>
      </div>

      {/* Table Area */}
      {loading ? (
        <TableSkeleton />
      ) : paginatedEmployees.length === 0 ? (
        <EmptyState
          title="No Employee Found"
          description="Employee data will appear here."
        />
      ) : (
        <div className="overflow-x-auto w-full">
          <table className="w-full whitespace-nowrap text-sm text-slate-600">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="py-4 px-2 text-left font-medium text-slate-400">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-slate-600">Profile</div>
                </th>
                <th className="py-4 px-2 text-left font-medium text-slate-400">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-slate-600">NIK <ChevronsUpDown size={14} /></div>
                </th>
                <th className="py-4 px-2 text-left font-medium text-slate-400">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-slate-600">Name <ChevronsUpDown size={14} /></div>
                </th>
                <th className="py-4 px-2 text-left font-medium text-slate-400">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-slate-600">Email <ChevronsUpDown size={14} /></div>
                </th>
                <th className="py-4 px-2 text-left font-medium text-slate-400">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-slate-600">Phone <ChevronsUpDown size={14} /></div>
                </th>
                <th className="py-4 px-2 text-left font-medium text-slate-400">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-slate-600">Departments <ChevronsUpDown size={14} /></div>
                </th>
                <th className="py-4 px-2 text-left font-medium text-slate-400">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-slate-600">Positions <ChevronsUpDown size={14} /></div>
                </th>
                <th className="py-4 px-2 text-left font-medium text-slate-400">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-slate-600">Status <ChevronsUpDown size={14} /></div>
                </th>
                <th className="py-4 px-2 text-left font-medium text-slate-400">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-slate-600">Join Date <ChevronsUpDown size={14} /></div>
                </th>
                <th className="py-4 px-2 text-left font-medium text-slate-400">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-slate-600">Updated At <ChevronsUpDown size={14} /></div>
                </th>
                <th className="py-4 px-2 text-center font-medium text-slate-400">
                  <div className="flex items-center justify-center gap-1 cursor-pointer hover:text-slate-600">Action</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedEmployees.map((emp) => (
                <tr key={emp.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-2">
                    {emp.image ? (
                      <Image
                        src={emp.image}
                        alt={`${emp.firstName} ${emp.lastName}`}
                        width={36}
                        height={36}
                        className="rounded-full object-cover aspect-square border border-slate-200"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-xs font-semibold text-slate-500">
                        {emp.firstName?.charAt(0)}{emp.lastName?.charAt(0)}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-2 text-slate-500">{emp.nik}</td>
                  <td className="py-3 px-2">
                    <span className="font-semibold text-slate-800">{emp.firstName} {emp.lastName}</span>
                  </td>
                  <td className="py-3 px-2 text-slate-500">{emp.email}</td>
                  <td className="py-3 px-2 text-slate-500">{emp.phone}</td>
                  <td className="py-3 px-2 text-slate-500">{emp.departmentCode}</td>
                  <td className="py-3 px-2 text-slate-500">{emp.positionCode}</td>
                  <td className="py-3 px-2">
                    <span className={`inline-flex items-center justify-center px-3 py-1 text-xs font-semibold rounded-full ${
                      emp.status === "Active" 
                        ? "bg-green-100 text-green-600" 
                        : "bg-red-100 text-red-500"
                    }`}>
                      {emp.status}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-slate-500">
                    {formatDate(emp.joinDate)}
                  </td>
                  <td className="py-3 px-2 text-slate-500">
                    {formatDate(emp.updatedAt)}
                  </td>
                  <td className="py-3 px-2 text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors mx-auto">
                        <MoreHorizontal size={18} />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-32">
                        <Link href={`/dashboard/employees/${emp.id}`} className="w-full">
                          <DropdownMenuItem className="cursor-pointer">View</DropdownMenuItem>
                        </Link>
                        {hasPermission("employee.update") && (
                          <Link href={`/dashboard/employees/edit/${emp.id}`} className="w-full">
                            <DropdownMenuItem className="cursor-pointer">Edit</DropdownMenuItem>
                          </Link>
                        )}
                        {hasPermission("employee.delete") && (
                          <div onClick={(e) => e.stopPropagation()}>
                            <DeleteEmployeeButton
                              id={emp.id}
                              fullName={`${emp.firstName} ${emp.lastName}`}
                              onSuccess={loadEmployees}
                            />
                          </div>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Footer */}
      {!loading && paginatedEmployees.length > 0 && (
        <div className="mt-6 flex items-center justify-end gap-2 pt-4">
          <Button
            variant="ghost"
            className="text-slate-500 hover:text-slate-800 font-medium gap-1"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            &lt; Previous
          </Button>

          <div className="flex items-center gap-1 mx-4">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                  currentPage === page 
                    ? "bg-[#3B82F6] text-white shadow-sm" 
                    : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                {page.toString().padStart(2, '0')}
              </button>
            ))}
          </div>

          <Button
            variant="ghost"
            className="text-slate-500 hover:text-slate-800 font-medium gap-1"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next &gt;
          </Button>
        </div>
      )}

    </div>
  );
}
