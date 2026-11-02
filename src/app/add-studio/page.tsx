import type { Metadata } from "next";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { AddStudioForm } from "@/components/studios/add-studio-form";

export const metadata: Metadata = {
  title: "Add New Studio",
};

export default function AddStudioPage() {
  return (
    <ProtectedRoute>
      <AddStudioForm />
    </ProtectedRoute>
  );
}
