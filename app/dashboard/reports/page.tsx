"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { employeeService } from "@/features/employee/services/employee-service";
import { departmentService } from "@/features/department/services/department-service";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    totalDepartments: 0,
  });
  const [deptData, setDeptData] = useState<any[]>([]);
  const [genderData, setGenderData] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [employees, departments] = await Promise.all([
          employeeService.getAll(),
          departmentService.getAll()
        ]);

        const activeEmployees = employees.filter(e => e.status === "Active").length;

        // Group by department
        const deptCount: Record<string, number> = {};
        // Group by gender
        const genderCount: Record<string, number> = { Male: 0, Female: 0 };

        employees.forEach(emp => {
          deptCount[emp.departmentCode] = (deptCount[emp.departmentCode] || 0) + 1;
          if (emp.gender === "Male" || emp.gender === "Female") {
            genderCount[emp.gender] += 1;
          }
        });

        const formattedDeptData = departments.map(dept => ({
          name: dept.name,
          total: deptCount[dept.code] || 0
        }));

        const formattedGenderData = [
          { name: "Male", value: genderCount.Male },
          { name: "Female", value: genderCount.Female },
        ];

        setStats({
          totalEmployees: employees.length,
          activeEmployees,
          totalDepartments: departments.length,
        });

        setDeptData(formattedDeptData);
        setGenderData(formattedGenderData);

      } catch (error) {
        console.error("Failed to load reports", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  if (loading) {
    return <p className="p-8 text-center text-slate-500">Loading reports...</p>;
  }

  return (
    <>
      <PageHeader
        title="Reports"
        description="Employee statistics and analytics."
      />

      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalEmployees}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Active Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.activeEmployees}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Departments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalDepartments}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Employees per Department</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gender Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                >
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
