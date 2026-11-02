import type { Booking, Review, Studio } from "./types";

/**
 * Local seed data used when NEXT_PUBLIC_API_URL is not configured or the
 * backend is unreachable. Once the Express/MongoDB server is connected via
 * env vars, every fetch below goes straight to the API instead.
 */
export const SEED_STUDIOS: Studio[] = [
  {
    _id: "65f1a0000000000000000101",
    title: "Northlight Cyc Wall — Daylight Photo Bay",
    category: "Photo Studio",
    hourlyRate: 85,
    securityDeposit: 200,
    maxCapacity: 12,
    location: "Greenpoint, Brooklyn, NY",
    imageUrl:
      "https://images.unsplash.com/photo-1598653222000-6b7b7a552625?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1598653222000-6b7b7a552625?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1567443024551-f3e3cc2be870?auto=format&fit=crop&w=1200&q=80",
    ],
    amenities: ["Cyc Wall", "Natural Light", "C-Stands", "Makeup Station", "Freight Elevator", "Free Wi-Fi"],
    overview:
      "A 24-foot seamless white cyclorama with 14-foot north-facing windows for clean, wraparound daylight. Grip package, rolling carts and a client lounge with a monitor feed from the shooting floor. Ideal for fashion, product and editorial work.",
    ownerEmail: "host@studiospace.dev",
    ownerName: "Elena Vasquez",
    rating: 4.9,
    reviewCount: 128,
    createdAt: "2026-01-12T10:00:00.000Z",
  },
  {
    _id: "65f1a0000000000000000102",
    title: "Stage 9 — Cinema Sound Stage",
    category: "Film Stage",
    hourlyRate: 145,
    securityDeposit: 750,
    maxCapacity: 30,
    location: "Astoria, Queens, NY",
    imageUrl:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?auto=format&fit=crop&w=1200&q=80",
    ],
    amenities: ["Blackout Blinds", "Soundproofing", "Freight Elevator", "Parking", "24/7 Access", "Client Lounge"],
    overview:
      "A 4,800 sq ft blackout stage with a 20 ft lighting grid, dolly track and drive-in access. Treated for clean production audio with a dedicated quiet zone for interviews and dialogue scenes.",
    ownerEmail: "stage9@studiospace.dev",
    ownerName: "Marcus Reid",
    rating: 4.8,
    reviewCount: 74,
    createdAt: "2026-01-20T10:00:00.000Z",
  },
  {
    _id: "65f1a0000000000000000103",
    title: "The Green Room — Broadcast Podcast Lounge",
    category: "Podcast Lounge",
    hourlyRate: 45,
    securityDeposit: 100,
    maxCapacity: 6,
    location: "Williamsburg, Brooklyn, NY",
    imageUrl:
      "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1200&q=80",
    ],
    amenities: ["Podcast Mics", "Soundproofing", "4K Camera", "Free Wi-Fi", "Air Conditioning"],
    overview:
      "A fully treated four-seat podcast set with SM7B broadcasts, a Rodecaster Pro II and two locked-off 4K cameras for video episodes. Warm walnut panelling, practical lighting and a backdrop you can brand in minutes.",
    ownerEmail: "greenroom@studiospace.dev",
    ownerName: "Sofia Lindqvist",
    rating: 4.9,
    reviewCount: 96,
    createdAt: "2026-02-02T10:00:00.000Z",
  },
  {
    _id: "65f1a0000000000000000104",
    title: "Analog Room — Tracking & Mixing Suite",
    category: "Music Suite",
    hourlyRate: 70,
    securityDeposit: 300,
    maxCapacity: 8,
    location: "Bushwick, Brooklyn, NY",
    imageUrl:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1519508234439-4f23643125c1?auto=format&fit=crop&w=1200&q=80",
    ],
    amenities: ["PA System", "Drum Kit", "Soundproofing", "Kitchenette", "Free Wi-Fi", "24/7 Access"],
    overview:
      "A hybrid tracking room built around a 32-channel analog console and outboard chain, with a separate iso booth for vocals and amps. Engineer add-ons available, or bring your own and self-produce.",
    ownerEmail: "analog@studiospace.dev",
    ownerName: "Theo Bakker",
    rating: 4.7,
    reviewCount: 61,
    createdAt: "2026-02-10T10:00:00.000Z",
  },
  {
    _id: "65f1a0000000000000000105",
    title: "Clay & Canvas — Daylight Art Workshop",
    category: "Workshop",
    hourlyRate: 38,
    securityDeposit: 75,
    maxCapacity: 16,
    location: "Ridgewood, Queens, NY",
    imageUrl:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=1200&q=80",
    ],
    amenities: ["Natural Light", "Kitchenette", "Free Wi-Fi", "Parking", "Air Conditioning"],
    overview:
      "Sixteen easels, two pottery wheels and long communal benches under skylights. Sink stations, drying racks and a wipe-clean floor make this the easiest room in the city to teach a class in — and to clean up after.",
    ownerEmail: "claycanvas@studiospace.dev",
    ownerName: "Naomi Choi",
    rating: 4.8,
    reviewCount: 43,
    createdAt: "2026-02-18T10:00:00.000Z",
  },
  {
    _id: "65f1a0000000000000000106",
    title: "Golden Hour — Rooftop-Adjacent Photo Loft",
    category: "Photo Studio",
    hourlyRate: 62,
    securityDeposit: 150,
    maxCapacity: 10,
    location: "LIC, Queens, NY",
    imageUrl:
      "https://images.unsplash.com/photo-1567443024551-f3e3cc2be870?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1567443024551-f3e3cc2be870?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
    ],
    amenities: ["Natural Light", "Blackout Blinds", "C-Stands", "Editing Suite", "Free Wi-Fi", "Parking"],
    overview:
      "Corner windows on three sides throw warm directional light from 4pm until sunset — hence the name. White oak floors, a movable white wall and an on-site editing bay for same-day selects.",
    ownerEmail: "goldenhour@studiospace.dev",
    ownerName: "Jules Moreau",
    rating: 4.6,
    reviewCount: 58,
    createdAt: "2026-02-25T10:00:00.000Z",
  },
  {
    _id: "65f1a0000000000000000107",
    title: "Blackbox — Narrative Film Stage",
    category: "Film Stage",
    hourlyRate: 120,
    securityDeposit: 600,
    maxCapacity: 25,
    location: "Sunset Park, Brooklyn, NY",
    imageUrl:
      "https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1200&q=80",
    ],
    amenities: ["Green Screen", "Blackout Blinds", "Soundproofing", "Freight Elevator", "Parking", "24/7 Access"],
    overview:
      "A true blackbox with 18 ft of hard green screen, cyc-ready floor paint and a full grid package. Production office, client monitors and a load-in dock that fits a box truck.",
    ownerEmail: "blackbox@studiospace.dev",
    ownerName: "Andre Whitfield",
    rating: 4.9,
    reviewCount: 87,
    createdAt: "2026-03-01T10:00:00.000Z",
  },
  {
    _id: "65f1a0000000000000000108",
    title: "Tone Loft — Vocal & Podcast Hybrid",
    category: "Podcast Lounge",
    hourlyRate: 52,
    securityDeposit: 120,
    maxCapacity: 5,
    location: "Fort Greene, Brooklyn, NY",
    imageUrl:
      "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1589903308904-1010c2294adc?auto=format&fit=crop&w=1200&q=80",
    ],
    amenities: ["Podcast Mics", "Soundproofing", "4K Camera", "Air Conditioning", "Free Wi-Fi"],
    overview:
      "Three-mic roundtable setup with a acoustically treated booth, key light and a soft-focus camera for vertical clips. Record audio and video in one pass with a push-button stream deck preset.",
    ownerEmail: "toneloft@studiospace.dev",
    ownerName: "Hana Suzuki",
    rating: 4.7,
    reviewCount: 39,
    createdAt: "2026-03-05T10:00:00.000Z",
  },
  {
    _id: "65f1a0000000000000000109",
    title: "The Rehearsal — Band Suite with Drum Room",
    category: "Music Suite",
    hourlyRate: 55,
    securityDeposit: 200,
    maxCapacity: 12,
    location: "Gowanus, Brooklyn, NY",
    imageUrl:
      "https://images.unsplash.com/photo-1519508234439-4f23643125c1?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1519508234439-4f23643125c1?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=80",
    ],
    amenities: ["PA System", "Drum Kit", "Soundproofing", "Parking", "24/7 Access", "Kitchenette"],
    overview:
      "A loud-friendly rehearsal room with a isolated drum enclosure, backline amps and a 1,200W PA. Hourly or block rates — perfect for pre-tour rehearsals and live session recordings.",
    ownerEmail: "rehearsal@studiospace.dev",
    ownerName: "Owen Fitzgerald",
    rating: 4.6,
    reviewCount: 52,
    createdAt: "2026-03-08T10:00:00.000Z",
  },
  {
    _id: "65f1a000000000000000010a",
    title: "Maker Bench — Print & Ceramics Workshop",
    category: "Workshop",
    hourlyRate: 42,
    securityDeposit: 100,
    maxCapacity: 14,
    location: "Bed-Stuy, Brooklyn, NY",
    imageUrl:
      "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1200&q=80",
    ],
    amenities: ["Natural Light", "Kitchenette", "Free Wi-Fi", "Air Conditioning", "Parking"],
    overview:
      "Screen-printing carousels, a slab roller and ventilated kiln area share one big open room. Washout sinks and a photo-emulsion darkroom round out the setup for print and clay workshops alike.",
    ownerEmail: "makerbench@studiospace.dev",
    ownerName: "Rafael Duarte",
    rating: 4.8,
    reviewCount: 34,
    createdAt: "2026-03-11T10:00:00.000Z",
  },
  {
    _id: "65f1a000000000000000010b",
    title: "Softbox Studio — E-Commerce Product Bay",
    category: "Photo Studio",
    hourlyRate: 48,
    securityDeposit: 120,
    maxCapacity: 8,
    location: "Chelsea, Manhattan, NY",
    imageUrl:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1598653222000-6b7b7a552625?auto=format&fit=crop&w=1200&q=80",
    ],
    amenities: ["Blackout Blinds", "Editing Suite", "C-Stands", "Makeup Station", "Free Wi-Fi"],
    overview:
      "A controlled-light product bay with a 10 ft shooting table, tethering station and motorized seamless rolls in six colors. Built for high-volume catalog work with fast turnaround.",
    ownerEmail: "softbox@studiospace.dev",
    ownerName: "Ingrid Larsen",
    rating: 4.5,
    reviewCount: 47,
    createdAt: "2026-03-14T10:00:00.000Z",
  },
  {
    _id: "65f1a000000000000000010c",
    title: "Vinyl Room — Analog Listening & Recording",
    category: "Music Suite",
    hourlyRate: 66,
    securityDeposit: 250,
    maxCapacity: 9,
    location: "Astoria, Queens, NY",
    imageUrl:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80",
    ],
    amenities: ["PA System", "Soundproofing", "Natural Light", "Kitchenette", "Free Wi-Fi"],
    overview:
      "Warm wood treatment, a vintage upright piano and a tape machine that still runs. Set up for full-band tracking or an intimate listening session with clients and collaborators.",
    ownerEmail: "vinyl@studiospace.dev",
    ownerName: "Camille Dubois",
    rating: 4.9,
    reviewCount: 65,
    createdAt: "2026-03-17T10:00:00.000Z",
  },
];

const SEED_REVIEWS: Record<string, Review[]> = {
  default: [
    {
      _id: "r1",
      studioId: "default",
      authorName: "Amara Okafor",
      rating: 5,
      comment:
        "Spotless space and the host had the grip package pre-racked before we arrived. We wrapped an hour early because everything just worked.",
      createdAt: "2026-02-14T10:00:00.000Z",
      authorAvatar:
        "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=200&q=80",
    },
    {
      _id: "r2",
      studioId: "default",
      authorName: "Diego Marín",
      rating: 5,
      comment:
        "Booked three sessions in a row and the calendar never slipped. Pricing was exactly what the listing said — deposit returned the next morning.",
      createdAt: "2026-02-28T10:00:00.000Z",
      authorAvatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    },
    {
      _id: "r3",
      studioId: "default",
      authorName: "Priya Raghavan",
      rating: 4,
      comment:
        "Great light and easy load-in. Only note: street parking gets tight after 5pm, so give yourself fifteen extra minutes or use the garage.",
      createdAt: "2026-03-02T10:00:00.000Z",
      authorAvatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    },
  ],
};

export const SEED_BOOKINGS: Booking[] = [
  {
    _id: "b1",
    studioId: "65f1a0000000000000000103",
    studioTitle: "The Green Room — Broadcast Podcast Lounge",
    studioImage:
      "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=400&q=80",
    studioLocation: "Williamsburg, Brooklyn, NY",
    userEmail: "examiner@studiospace.dev",
    date: "2026-03-24",
    startTime: "10:00",
    endTime: "13:00",
    hours: 3,
    totalAmount: 135,
    status: "Pending",
    createdAt: "2026-03-18T09:30:00.000Z",
  },
  {
    _id: "b2",
    studioId: "65f1a0000000000000000101",
    studioTitle: "Northlight Cyc Wall — Daylight Photo Bay",
    studioImage:
      "https://images.unsplash.com/photo-1598653222000-6b7b7a552625?auto=format&fit=crop&w=400&q=80",
    studioLocation: "Greenpoint, Brooklyn, NY",
    userEmail: "examiner@studiospace.dev",
    date: "2026-03-10",
    startTime: "09:00",
    endTime: "14:00",
    hours: 5,
    totalAmount: 425,
    status: "Confirmed",
    createdAt: "2026-03-04T14:00:00.000Z",
  },
];

export function getSeedStudio(id: string): Studio | undefined {
  return SEED_STUDIOS.find((s) => s._id === id);
}

export function getSeedReviews(studioId: string): Review[] {
  return (SEED_REVIEWS[studioId] ?? SEED_REVIEWS.default).map((r) => ({
    ...r,
    studioId,
  }));
}
