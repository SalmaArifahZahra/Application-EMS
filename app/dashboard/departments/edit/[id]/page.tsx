import { EditDepartmentPage } from "@/features/department/components/department-edit-page";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <EditDepartmentPage params={params} />;
}
