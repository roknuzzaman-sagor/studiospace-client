import type { Booking, Review, Studio } from "./types";
import {
  SEED_BOOKINGS,
  SEED_STUDIOS,
  getSeedReviews,
  getSeedStudio,
} from "./seed-data";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

/** True when a real backend is configured via NEXT_PUBLIC_API_URL. */
export const hasBackend = API_URL.length > 0;

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    credentials: "include", // keeps the HTTPOnly JWT cookie attached (Challenge 1)
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error ?? `Request failed (${res.status})`);
  }
  return (await res.json()) as T;
}

/* ------------------------------- Studios ------------------------------- */

export async function fetchStudios(
  params: { category?: string; search?: string } = {},
): Promise<Studio[]> {
  if (!hasBackend) {
    let list = SEED_STUDIOS;
    if (params.category && params.category !== "all") {
      list = list.filter(
        (s) => s.category.toLowerCase().replace(/\s+/g, "-") === params.category,
      );
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.location.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q),
      );
    }
    return list;
  }
  const query = new URLSearchParams();
  if (params.category) query.set("category", params.category);
  if (params.search) query.set("search", params.search);
  const qs = query.toString();
  return request<Studio[]>(`/api/studios${qs ? `?${qs}` : ""}`);
}

export async function fetchFeaturedStudios(): Promise<Studio[]> {
  const studios = await fetchStudios();
  return [...studios]
    .sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
    .slice(0, 6);
}

export async function fetchStudio(id: string): Promise<Studio | null> {
  if (!hasBackend) return getSeedStudio(id) ?? null;
  try {
    return await request<Studio>(`/api/studios/${id}`);
  } catch {
    return null;
  }
}

export async function fetchReviews(studioId: string): Promise<Review[]> {
  if (!hasBackend) return getSeedReviews(studioId);
  try {
    return await request<Review[]>(`/api/studios/${studioId}/reviews`);
  } catch {
    return [];
  }
}

export async function createStudio(
  payload: Omit<Studio, "_id" | "rating" | "reviewCount" | "createdAt">,
): Promise<Studio> {
  if (!hasBackend) {
    return {
      ...payload,
      _id: `local-${Date.now()}`,
      rating: 0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
    };
  }
  return request<Studio>("/api/studios", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateStudio(
  id: string,
  payload: Partial<Studio>,
): Promise<Studio> {
  if (!hasBackend) {
    const existing = getSeedStudio(id);
    if (!existing) throw new Error("Studio not found");
    return { ...existing, ...payload };
  }
  return request<Studio>(`/api/studios/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteStudio(id: string): Promise<void> {
  if (!hasBackend) return;
  await request(`/api/studios/${id}`, { method: "DELETE" });
}

/* ------------------------------- Bookings ------------------------------ */

export async function fetchBookings(userEmail: string): Promise<Booking[]> {
  if (!hasBackend) {
    return SEED_BOOKINGS.filter((b) => b.userEmail === userEmail);
  }
  return request<Booking[]>(
    `/api/bookings?userEmail=${encodeURIComponent(userEmail)}`,
  );
}

export async function createBooking(
  payload: Omit<Booking, "_id" | "status" | "createdAt">,
): Promise<Booking> {
  if (!hasBackend) {
    return {
      ...payload,
      _id: `local-${Date.now()}`,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };
  }
  return request<Booking>("/api/bookings", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function cancelBooking(id: string): Promise<Booking> {
  if (!hasBackend) {
    const booking = SEED_BOOKINGS.find((b) => b._id === id);
    if (!booking) throw new Error("Booking not found");
    return { ...booking, status: "Cancelled" };
  }
  return request<Booking>(`/api/bookings/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status: "Cancelled" }),
  });
}
