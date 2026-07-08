"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { employeeService } from "@/features/employee/services/employee-service";
import { departmentService } from "@/features/department/services/department-service";
import { positionService } from "@/features/position/service/position-service";
import { userService } from "@/features/user/services/user-service";
import { Users, Building2, Briefcase, UserCheck } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import type { Employee } from "@/features/employee/types";

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalDepartments: 0,
    totalPositions: 0,
    totalUsers: 0,
  });

  const [barChartData, setBarChartData] = useState<any[]>([]);
  const [pieChartData, setPieChartData] = useState<any[]>([]);
  const [recentEmployees, setRecentEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    async function loadStats() {
      try {
        const [employees, departments, positions, users] = await Promise.all([
          employeeService.getAll(),
          departmentService.getAll(),
          positionService.getAll(),
          user?.role === "superadmin" ? userService.getAll() : Promise.resolve([]),
        ]);

        setStats({
          totalEmployees: employees.length,
          totalDepartments: departments.length,
          totalPositions: positions.length,
          totalUsers: users.length,
        });

        const genderCount = { Male: 0, Female: 0 };
        employees.forEach((emp) => {
          if (emp.gender === "Male" || emp.gender === "Laki-laki") genderCount.Male++;
          else genderCount.Female++;
        });
        setPieChartData([
          { name: "Laki-laki", value: genderCount.Male },
          { name: "Perempuan", value: genderCount.Female },
        ]);

        const deptCount: Record<string, number> = {};
        employees.forEach((emp) => {
          deptCount[emp.departmentCode] = (deptCount[emp.departmentCode] || 0) + 1;
        });

        const data = Object.keys(deptCount).map((dept) => ({
          name: dept,
          employees: deptCount[dept],
        }));
        setBarChartData(data);

        const sortedEmployees = [...employees].sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setRecentEmployees(sortedEmployees.slice(0, 5));

      } catch (error) {
        console.error("Failed to load dashboard stats", error);
      }
    }
    loadStats();
  }, [user]);

  const PIE_COLORS = ["#0B1849", "#E4B028"];

  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

        {/* card 1 */}
        <div className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0B1849]/10 text-[#0B1849]">
            <Users size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Employees</p>
            <h3 className="text-2xl font-bold text-[#0B1849]">{stats.totalEmployees}</h3>
          </div>
        </div>

        {/* card 2 */}
        <div className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#124D1C]/10 text-[#124D1C]">
            <Building2 size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Departements</p>
            <h3 className="text-2xl font-bold text-[#0B1849]">{stats.totalDepartments}</h3>
          </div>
        </div>

        {/* card 3 */}
        <div className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E4B028]/10 text-[#E4B028]">
            <Briefcase size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Positions</p>
            <h3 className="text-2xl font-bold text-[#0B1849]">{stats.totalPositions}</h3>
          </div>
        </div>

        {/* card 4 */}
        <div className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/10 text-purple-600">
            <UserCheck size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Users</p>
            <h3 className="text-2xl font-bold text-[#0B1849]">{stats.totalUsers}</h3>
          </div>
        </div>

      </div>

      {/* section chart */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* pie Chart */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-slate-700">Statistik Gender Karyawan</h2>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* bar Chart */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-slate-700">Employees by Departments</h2>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} allowDecimals={false} />
                <RechartsTooltip cursor={{ fill: 'transparent' }} />
                <Bar dataKey="employees" fill="#E4B028" radius={[4, 4, 0, 0]} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* karyawan history */}
      <div className="rounded-xl bg-white shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-sm font-semibold text-slate-700">Recent Employees</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-4 text-left font-medium">Employee Code</th>
                <th className="px-6 py-4 text-left font-medium">Employee Name</th>
                <th className="px-6 py-4 text-left font-medium">Departements</th>
                <th className="px-6 py-4 text-left font-medium">Join Date</th>
                <th className="px-6 py-4 text-left font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-700">{emp.employeeCode}</td>
                  <td className="px-6 py-4 text-slate-600">{emp.firstName} {emp.lastName}</td>
                  <td className="px-6 py-4 text-slate-600">{emp.departmentCode}</td>
                  <td className="px-6 py-4 text-slate-600">
                    {new Date(emp.joinDate).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block font-medium ${emp.status === "Active" ? "text-[#124D1C]" : "text-red-500"
                      }`}>
                      {emp.status}
                    </span>
                  </td>
                </tr>
              ))}
              {recentEmployees.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    There is no employee data yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </section>
  );
}