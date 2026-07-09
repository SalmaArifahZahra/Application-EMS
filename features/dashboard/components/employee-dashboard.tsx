"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { employeeService } from "@/features/employee/services/employee-service";
import type { Employee } from "@/features/employee/types";
import { 
  User, 
  Calendar, 
  Clock, 
  Briefcase, 
  Building2, 
  ShieldCheck, 
  CalendarDays,
} from "lucide-react";
import Image from "next/image";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

function generateRecentActivities(user: any, employee: Employee | null) {
  const activities = [];

  // Account 
  if (user?.createdAt) {
    activities.push({
      id: "user-created",
      title: "Account Created",
      time: formatDate(user.createdAt),
      timestamp: new Date(user.createdAt).getTime(),
      icon: User,
      color: "text-blue-500",
      bg: "bg-blue-100"
    });
  }

  // Profile 
  if (employee?.updatedAt) {
    activities.push({
      id: "profile-updated",
      title: "Profile Information Updated",
      time: formatDate(employee.updatedAt),
      timestamp: new Date(employee.updatedAt).getTime(),
      icon: Clock,
      color: "text-green-500",
      bg: "bg-green-100"
    });
  }

  // Joined 
  if (employee?.joinDate) {
    activities.push({
      id: "joined-company",
      title: "Joined Company",
      time: formatDate(employee.joinDate),
      timestamp: new Date(employee.joinDate).getTime(),
      icon: Briefcase,
      color: "text-amber-500",
      bg: "bg-amber-100"
    });
  }

  // Account updated 
  if (user?.updatedAt && user.updatedAt !== user.createdAt) {
    activities.push({
      id: "account-updated",
      title: "Account Settings Updated",
      time: formatDate(user.updatedAt),
      timestamp: new Date(user.updatedAt).getTime(),
      icon: ShieldCheck,
      color: "text-purple-500",
      bg: "bg-purple-100"
    });
  }


  activities.sort((a, b) => b.timestamp - a.timestamp);

  // 3 history
  return activities.slice(0, 3);
}

export function EmployeeDashboard() {
  const { user } = useAuth();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEmployeeData() {
      if (!user) return;
      try {
        const employees = await employeeService.getAll();
        const myEmployee = employees.find((emp) => emp.email === user.email);
        if (myEmployee) {
          setEmployee(myEmployee);
        }
      } catch (error) {
        console.error("Failed to load employee data", error);
      } finally {
        setLoading(false);
      }
    }
    loadEmployeeData();
  }, [user]);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  });

  const recentActivities = useMemo(() => {
    return generateRecentActivities(user, employee);
  }, [user, employee]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl bg-white p-6 shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Welcome Back, {employee ? `${employee.firstName} ${employee.lastName}` : user?.username}
          </h1>
          <p className="text-slate-500 mt-1">Manage your profile and stay updated with company information.</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-lg border border-slate-100 shrink-0">
          <Calendar className="h-5 w-5 text-blue-500" />
          <span className="text-sm font-medium text-slate-700">{today}</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Profile Summary */}
        <div className="lg:col-span-2">
          <Card className="border-slate-100 shadow-sm overflow-hidden h-full">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                {/* Profile Picture */}
                <div className="shrink-0 relative">
                  <div className="h-32 w-32 rounded-full border-4 border-slate-50 shadow-sm overflow-hidden bg-white">
                    {user?.image || employee?.image ? (
                      <Image 
                        src={user?.image || employee?.image || ""} 
                        alt="Profile" 
                        width={128} 
                        height={128}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-slate-100 text-slate-400">
                        <User size={48} />
                      </div>
                    )}
                  </div>
                  {employee && (
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border-2 border-white shadow-sm">
                      {employee.status}
                    </div>
                  )}
                </div>
                
                {/* Profile Details */}
                <div className="flex-1 text-center md:text-left w-full">
                  <div className="mb-6 border-b border-slate-100 pb-4">
                    <h2 className="text-2xl font-bold text-slate-800 mb-1">
                      {employee ? `${employee.firstName} ${employee.lastName}` : user?.username}
                    </h2>
                    <p className="text-slate-500">{employee?.email || user?.email}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Building2 size={18} />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Department</p>
                        <p className="font-medium text-slate-700">{employee?.departmentCode || "-"}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <Briefcase size={18} />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Position</p>
                        <p className="font-medium text-slate-700">{employee?.positionCode || "-"}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                        <ShieldCheck size={18} />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Level</p>
                        <p className="font-medium text-slate-700">{employee?.nik ? "Staff" : "-"}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                        <CalendarDays size={18} />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Join Date</p>
                        <p className="font-medium text-slate-700">{employee ? formatDate(employee.joinDate) : "-"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Recent Activity */}
        <div>
          <Card className="border-slate-100 shadow-sm h-full">
            <CardHeader className="pb-4 border-b border-slate-50">
              <CardTitle className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <Clock size={18} className="text-slate-400" /> Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {recentActivities.length > 0 ? (
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="py-1">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-700">{activity.title}</span>
                        <span className="text-xs font-medium text-slate-500 mt-0.5">{activity.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400 text-sm font-medium">
                  No recent activity found.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
