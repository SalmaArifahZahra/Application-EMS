import { EditPositionPage } from "@/features/position/components/position-edit-page";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <EditPositionPage params={params} />;
}
