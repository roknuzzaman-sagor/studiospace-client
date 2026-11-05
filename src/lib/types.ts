export type StudioCategory =
  | "Photo Studio"
  | "Film Stage"
  | "Podcast Lounge"
  | "Music Suite"
  | "Workshop";

export type BookingStatus =
  | "Pending"
  | "Confirmed"
  | "Completed"
  | "Cancelled";

export interface Studio {
  _id: string;
  title: string;
  category: StudioCategory;
  hourlyRate: number;
  securityDeposit: number;
  maxCapacity: number;
  location: string;
  imageUrl: string;
  gallery?: string[];
  amenities: string[];
  overview: string;
  ownerEmail: string;
  ownerName: string;
  rating: number;
  reviewCount: number;
  createdAt: string;
}

export interface Review {
  _id: string;
  studioId: string;
  authorName: string;
  authorAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Booking {
  _id: string;
  studioId: string;
  studioTitle: string;
  studioImage: string;
  studioLocation: string;
  userEmail: string;
  date: string;
  startTime: string;
  endTime: string;
  hours: number;
  totalAmount: number;
  status: BookingStatus;
  createdAt: string;
}

export interface AuthUser {
  _id?: string;
  name: string;
  email: string;
  photoURL: string;
}
