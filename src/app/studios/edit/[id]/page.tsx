import type { Metadata } from "next";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { EditStudioForm } from "@/components/studios/edit-studio-form";

export const metadata: Metadata = {
  title: "Update Studio",
};

export const instant = false;

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditStudioPage({ params }: Props) {
  const { id } = await params;

  return (
    <ProtectedRoute>
      <EditStudioForm id={id} />
    </ProtectedRoute>
  );
}
