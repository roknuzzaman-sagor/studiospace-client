import type { Metadata } from "next";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { MyBookings } from "@/components/bookings/my-bookings";

export const metadata: Metadata = {
  title: "My Bookings",
};

export default function MyBookingsPage() {
  return (
    <ProtectedRoute>
      <MyBookings />
    </ProtectedRoute>
  );
}
