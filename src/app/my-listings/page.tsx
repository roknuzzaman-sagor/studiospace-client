import type { Metadata } from "next";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { MyListings } from "@/components/studios/my-listings";

export const metadata: Metadata = {
  title: "My Studio Listings",
};

export default function MyListingsPage() {
  return (
    <ProtectedRoute>
      <MyListings />
    </ProtectedRoute>
  );
}
