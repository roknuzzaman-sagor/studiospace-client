import type { Metadata } from "next";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { SavedStudios } from "@/components/studios/saved-studios";

export const metadata: Metadata = {
  title: "Saved Studios",
  description: "Your wishlist of studios on StudioSpace.",
};

export default function SavedStudiosPage() {
  return (
    <ProtectedRoute>
      <SavedStudios />
    </ProtectedRoute>
  );
}
