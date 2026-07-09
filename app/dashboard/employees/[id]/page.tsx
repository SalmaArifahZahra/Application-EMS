import { EmployeeDetailPage } from "@/features/employee/components/employee-detail-page";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <EmployeeDetailPage params={params} />;
}
