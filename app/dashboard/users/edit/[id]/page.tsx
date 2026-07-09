import { EditUserPage } from "@/features/user/components/user-edit-page";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <EditUserPage params={params} />;
}
