import { ProtectedRoute } from "@/features/auth/components/protected-route";
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import { DashboardSidebar } from "@/features/dashboard/components/dashboard-sidebar";
import { SidebarProvider } from "@/features/dashboard/contexts/sidebar-context";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <div className="flex h-screen w-full overflow-hidden bg-[#EBEDE3]">
          <DashboardSidebar />

          <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
            <DashboardHeader />

            <main className="flex-1 p-4 md:p-6 lg:p-8">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
}