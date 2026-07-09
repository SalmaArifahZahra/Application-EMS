"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Papa from "papaparse";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/data-display/empty-state";
import { TableSkeleton } from "@/components/feedback/table-skeleton";
import { SearchInput } from "@/components/form/search-input";
import { Filter, Upload, Plus, MoreHorizontal, ChevronsUpDown, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { departmentService } from "@/features/department/services/department-service";
import { ConfirmDialog } from "@/components/feedback/confirm-dialog";
import type { Department } from "@/features/department/types";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { formatDate } from "@/lib/utils";

export function DepartmentsPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState<string>("");

  async function loadDepartments() {
    try {
      setLoading(true);
      const data = await departmentService.getAll();
      setDepartments(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDepartments();
  }, []);

  async function handleDelete() {
    if (!deleteId) return;
    try {
      await departmentService.delete(deleteId);
      toast("Department deleted successfully", {
        description: `Department "${deleteName}" has been removed.`,
        icon: <Trash2 size={16} className="text-red-500" />,
      });
      loadDepartments();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete department", {
        description: "An error occurred while deleting the department.",
      });
    } finally {
      setDeleteId(null);
    }
  }

  const filteredData = departments.filter((dept) => {
    const keyword = search.toLowerCase();
    return (
      dept.code.toLowerCase().includes(keyword) ||
      dept.name.toLowerCase().includes(keyword)
    );
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  function handleExportCSV() {
    const csv = Papa.unparse(departments);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "departments.csv");
    link.click();
  }

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 md:p-8 shadow-sm">
      
      <div className="mb-8 w-full md:max-w-md">
        <SearchInput
          value={search}
          onChange={(v) => { setSearch(v); setCurrentPage(1); }}
          placeholder="Search..."
        />
      </div>

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Departments</h1>
        
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
          
          <Button variant="outline" className="gap-2 text-slate-600 rounded-lg border-slate-200">
            <Filter size={16} /> Filter
          </Button>

          <Button variant="outline" onClick={handleExportCSV} className="gap-2 text-slate-600 rounded-lg border-slate-200">
            <Upload size={16} /> Export
          </Button>

          <Button onClick={() => router.push("/dashboard/departments/create")} className="bg-[#3B82F6] hover:bg-blue-600 text-white gap-2 rounded-lg px-4 shadow-sm">
            <Plus size={16} /> Add New Department
          </Button>
        </div>
      </div>

      {loading ? (
        <TableSkeleton />
      ) : paginatedData.length === 0 ? (
        <EmptyState
          title="No Department Found"
          description="Department data will appear here."
        />
      ) : (
        <div className="overflow-x-auto w-full">
          <table className="w-full whitespace-nowrap text-sm text-slate-600">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="py-4 px-2 text-left font-medium text-slate-400">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-slate-600">Code <ChevronsUpDown size={14} /></div>
                </th>
                <th className="py-4 px-2 text-left font-medium text-slate-400">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-slate-600">Department Name <ChevronsUpDown size={14} /></div>
                </th>
                <th className="py-4 px-2 text-left font-medium text-slate-400">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-slate-600">Description <ChevronsUpDown size={14} /></div>
                </th>
                <th className="py-4 px-2 text-left font-medium text-slate-400">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-slate-600">Manager Code <ChevronsUpDown size={14} /></div>
                </th>
                <th className="py-4 px-2 text-left font-medium text-slate-400">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-slate-600">Status <ChevronsUpDown size={14} /></div>
                </th>
                <th className="py-4 px-2 text-left font-medium text-slate-400">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-slate-600">Created At <ChevronsUpDown size={14} /></div>
                </th>
                <th className="py-4 px-2 text-left font-medium text-slate-400">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-slate-600">Updated At <ChevronsUpDown size={14} /></div>
                </th>
                <th className="py-4 px-2 text-center font-medium text-slate-400">
                  <div className="flex items-center justify-center gap-1 cursor-pointer hover:text-slate-600">Action <ChevronsUpDown size={14} /></div>
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((dept) => (
                <tr key={dept.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-2 font-semibold text-slate-800">{dept.code}</td>
                  <td className="py-3 px-2 text-slate-600">{dept.name}</td>
                  <td className="py-3 px-2 text-slate-500">{dept.description}</td>
                  <td className="py-3 px-2 text-slate-500">{dept.managerEmployeeCode || "-"}</td>
                  <td className="py-3 px-2">
                    <span className={`inline-flex items-center justify-center px-3 py-1 text-xs font-semibold rounded-full ${
                      dept.isActive 
                        ? "bg-green-100 text-green-600" 
                        : "bg-red-100 text-red-500"
                    }`}>
                      {dept.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-slate-500">
                    {formatDate(dept.createdAt)}
                  </td>
                  <td className="py-3 px-2 text-slate-500">
                    {formatDate(dept.updatedAt)}
                  </td>
                  <td className="py-3 px-2 text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors mx-auto">
                        <MoreHorizontal size={18} />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-32">
                        <Link href={`/dashboard/departments/${dept.id}`} className="w-full">
                          <DropdownMenuItem className="cursor-pointer">View</DropdownMenuItem>
                        </Link>
                        <Link href={`/dashboard/departments/edit/${dept.id}`} className="w-full">
                          <DropdownMenuItem className="cursor-pointer">Edit</DropdownMenuItem>
                        </Link>
                        {user?.role === "superadmin" && (
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteId(dept.id);
                              setDeleteName(dept.name);
                            }}
                            className="text-red-500 focus:text-red-500 cursor-pointer"
                          >
                            Delete
                          </DropdownMenuItem>
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

      {!loading && paginatedData.length > 0 && (
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

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Department"
        description={`Are you sure you want to delete department "${deleteName}"?`}
        onConfirm={handleDelete}
      />
    </div>
  );
}
