import axios from "axios";
import { CATEGORIES } from "./constants";
import type { Booking, BookingStatus, Review, Studio, StudioCategory } from "./types";

// Accept both `http://host:5000` and `http://host:5000/api` so a missing
// `/api` suffix in the environment never breaks every request.
const rawApiUrl =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const apiBaseUrl = /\/api\/?$/.test(rawApiUrl)
  ? rawApiUrl.replace(/\/+$/, "")
  : `${rawApiUrl.replace(/\/+$/, "")}/api`;

export const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
});

const FALLBACK_STUDIO_IMAGE =
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80";

interface ApiStudio {
  _id: string;
  title: string;
  category: string;
  hourlyRate: number;
  securityDeposit?: number;
  maxCapacity?: number;
  location?: string;
  imageURL?: string;
  imageUrl?: string;
  gallery?: string[];
  amenities?: string[];
  overview?: string;
  ownerEmail?: string;
  ownerName?: string;
  rating?: number;
  reviewCount?: number;
  createdAt?: string;
}

interface ApiBooking {
  _id: string;
  studioId: string | { _id: string };
  studioTitle: string;
  userEmail: string;
  userName?: string;
  date: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: BookingStatus;
  createdAt?: string;
}

interface ApiReview {
  _id: string;
  studioId?: string;
  authorName?: string;
  userName?: string;
  authorAvatar?: string;
  user?: { name?: string; photoURL?: string };
  rating: number;
  comment: string;
  createdAt: string;
}

export interface StudioInput {
  title: string;
  category: string;
  hourlyRate: number;
  securityDeposit: number;
  maxCapacity: number;
  location: string;
  imageUrl: string;
  amenities: string[];
  overview: string;
}

export interface StudioQuery {
  category?: string;
  search?: string;
  sort?: string;
  limit?: number;
  minRate?: number;
  maxRate?: number;
}

export interface BookingInput {
  studioId: string;
  date: string;
  startTime: string;
  endTime: string;
  userName: string;
}

function categoryName(value: string): string {
  const match = CATEGORIES.find((c) => c.slug === value || c.name === value);
  return match?.name ?? value;
}

/**
 * Accepts the documented envelope (`{ [key]: [...] }`) plus a direct array or
 * a `{ data: ... }` wrapper, so list endpoints stay compatible across server
 * variants without changing the UI contract.
 */
function listFrom<T>(payload: unknown, key: string): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (!payload || typeof payload !== "object") return [];

  const record = payload as Record<string, unknown>;
  if (Array.isArray(record[key])) return record[key] as T[];

  const nested = record.data;
  if (Array.isArray(nested)) return nested as T[];
  if (nested && typeof nested === "object") {
    const value = (nested as Record<string, unknown>)[key];
    if (Array.isArray(value)) return value as T[];
  }
  return [];
}

export function mapStudio(raw: ApiStudio): Studio {
  const imageUrl = raw.imageURL || raw.imageUrl || FALLBACK_STUDIO_IMAGE;
  return {
    _id: raw._id,
    title: raw.title,
    category: raw.category as StudioCategory,
    hourlyRate: Number(raw.hourlyRate) || 0,
    securityDeposit: Number(raw.securityDeposit) || 0,
    maxCapacity: Number(raw.maxCapacity) || 1,
    location: raw.location ?? "",
    imageUrl,
    gallery: raw.gallery?.length ? raw.gallery : [imageUrl],
    amenities: raw.amenities ?? [],
    overview: raw.overview ?? "",
    ownerEmail: raw.ownerEmail ?? "",
    ownerName: raw.ownerName ?? "StudioSpace Host",
    rating: Number(raw.rating) || 0,
    reviewCount: Number(raw.reviewCount) || 0,
    createdAt: raw.createdAt ?? "",
  };
}

function bookingStudioId(raw: ApiBooking): string {
  return typeof raw.studioId === "string" ? raw.studioId : raw.studioId._id;
}

function hoursBetween(startTime: string, endTime: string): number {
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);
  const minutes =
    endHour * 60 + endMinute - (startHour * 60 + startMinute);
  return minutes > 0 ? minutes / 60 : 0;
}

export function mapBooking(raw: ApiBooking, studio?: Studio): Booking {
  return {
    _id: raw._id,
    studioId: bookingStudioId(raw),
    studioTitle: raw.studioTitle,
    studioImage: studio?.imageUrl ?? FALLBACK_STUDIO_IMAGE,
    studioLocation: studio?.location ?? "",
    userEmail: raw.userEmail,
    date: raw.date,
    startTime: raw.startTime,
    endTime: raw.endTime,
    hours: hoursBetween(raw.startTime, raw.endTime),
    totalAmount: Number(raw.totalPrice) || 0,
    status: raw.status,
    createdAt: raw.createdAt ?? "",
  };
}

export async function fetchStudios(params: StudioQuery = {}): Promise<Studio[]> {
  const query: Record<string, string | number> = {};
  if (params.category && params.category !== "all") {
    query.category = categoryName(params.category);
  }
  if (params.search) query.search = params.search;
  if (params.sort && params.sort !== "featured") query.sort = params.sort;
  if (params.limit) query.limit = params.limit;
  if (params.minRate !== undefined) query.minRate = params.minRate;
  if (params.maxRate !== undefined) query.maxRate = params.maxRate;

  const { data } = await api.get<unknown>("/studios", {
    params: query,
  });
  return listFrom<ApiStudio>(data, "studios").map(mapStudio);
}

export async function fetchFeaturedStudios(): Promise<Studio[]> {
  const { data } = await api.get<unknown>("/studios/featured");
  return listFrom<ApiStudio>(data, "studios").slice(0, 6).map(mapStudio);
}

export async function fetchStudio(id: string): Promise<Studio | null> {
  try {
    const { data } = await api.get<{ studio: ApiStudio }>(`/studios/${id}`);
    return mapStudio(data.studio);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function fetchReviews(studioId: string): Promise<Review[]> {
  try {
    const { data } = await api.get<unknown>(`/studios/${studioId}/reviews`);
    return listFrom<ApiReview>(data, "reviews").map((review) => ({
      _id: review._id,
      studioId: review.studioId ?? studioId,
      authorName:
        review.authorName ?? review.userName ?? review.user?.name ?? "Creator",
      authorAvatar: review.authorAvatar ?? review.user?.photoURL,
      rating: Number(review.rating) || 0,
      comment: review.comment,
      createdAt: review.createdAt,
    }));
  } catch {
    return [];
  }
}

export async function fetchMyListings(): Promise<Studio[]> {
  const { data } = await api.get<unknown>("/studios/my-listings");
  return listFrom<ApiStudio>(data, "studios").map(mapStudio);
}

export async function createStudio(input: StudioInput): Promise<Studio> {
  const { imageUrl, ...rest } = input;
  const { data } = await api.post<{ studio: ApiStudio }>("/studios", {
    ...rest,
    imageURL: imageUrl,
  });
  return mapStudio(data.studio);
}

export async function updateStudio(
  id: string,
  input: StudioInput,
): Promise<Studio> {
  const { imageUrl, ...rest } = input;
  const { data } = await api.put<{ studio: ApiStudio }>(`/studios/${id}`, {
    ...rest,
    imageURL: imageUrl,
  });
  return mapStudio(data.studio);
}

export async function deleteStudio(id: string): Promise<void> {
  await api.delete(`/studios/${id}`);
}

export async function fetchMyBookings(): Promise<Booking[]> {
  const { data } = await api.get<unknown>("/bookings/my-bookings");
  const bookings = listFrom<ApiBooking>(data, "bookings");
  const studios = await fetchStudios().catch(() => [] as Studio[]);
  const byId = new Map(studios.map((studio) => [studio._id, studio]));
  return bookings.map((booking) =>
    mapBooking(booking, byId.get(bookingStudioId(booking))),
  );
}

export async function createBooking(input: BookingInput): Promise<Booking> {
  const { data } = await api.post<{ booking: ApiBooking }>("/bookings", input);
  return mapBooking(data.booking);
}

export async function cancelBooking(id: string): Promise<Booking> {
  const { data } = await api.patch<{ booking: ApiBooking }>(
    `/bookings/${id}/cancel`,
  );
  return mapBooking(data.booking);
}

export async function fetchWishlist(): Promise<Studio[]> {
  const { data } = await api.get<unknown>("/wishlist");
  type WishlistEntry = ApiStudio & { studioId?: ApiStudio | string };

  return listFrom<WishlistEntry>(data, "wishlist")
    .map((entry) => {
      const value = entry.studioId ?? entry;
      return typeof value === "string" ? null : mapStudio(value);
    })
    .filter((studio): studio is Studio => Boolean(studio?._id));
}

export async function checkWishlist(studioId: string): Promise<boolean> {
  const { data } = await api.get<{ inWishlist: boolean }>(
    `/wishlist/check/${studioId}`,
  );
  return Boolean(data.inWishlist);
}

export async function addToWishlist(studioId: string): Promise<void> {
  await api.post("/wishlist", { studioId });
}

export async function removeFromWishlist(studioId: string): Promise<void> {
  await api.delete(`/wishlist/${studioId}`);
}
