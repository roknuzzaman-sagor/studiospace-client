import type { StudioCategory } from "./types";

export const CATEGORIES: {
  name: StudioCategory;
  slug: string;
  blurb: string;
  image: string;
}[] = [
  {
    name: "Photo Studio",
    slug: "photo-studio",
    blurb: "Cyc walls, daylight bays & seamless paper backdrops",
    image:
      "https://images.unsplash.com/photo-1598653222000-6b7b7a552625?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Film Stage",
    slug: "film-stage",
    blurb: "Cinema sound stages with grid, dolly track & blackout",
    image:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Podcast Lounge",
    slug: "podcast-lounge",
    blurb: "Treated rooms, broadcast mics & camera-ready sets",
    image:
      "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Music Suite",
    slug: "music-suite",
    blurb: "Tracking rooms, iso booths & analog consoles",
    image:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Workshop",
    slug: "workshop",
    blurb: "Art studios, maker benches & daylight classrooms",
    image:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=900&q=80",
  },
];

export const AMENITIES = [
  "Cyc Wall",
  "Blackout Blinds",
  "Natural Light",
  "Green Screen",
  "Editing Suite",
  "Makeup Station",
  "Kitchenette",
  "Free Wi-Fi",
  "Parking",
  "Freight Elevator",
  "Soundproofing",
  "PA System",
  "Drum Kit",
  "Grand Piano",
  "Podcast Mics",
  "4K Camera",
  "C-Stands",
  "Client Lounge",
  "Air Conditioning",
  "24/7 Access",
] as const;

export const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Discover Spaces",
    text: "Filter cyc walls, sound stages and podcast lounges by category, city, capacity and hourly rate.",
  },
  {
    step: "02",
    title: "Select Shoot Hours",
    text: "Pick your date and call time. Live availability shows which slots are already confirmed.",
  },
  {
    step: "03",
    title: "Book Instantly",
    text: "Reserve in one tap with transparent pricing — rate, hours and refundable deposit, no hidden fees.",
  },
  {
    step: "04",
    title: "Create & Produce",
    text: "Show up, roll camera. Your host is one message away for gear, parking and setup support.",
  },
];

export const GUARANTEES = [
  {
    title: "Liability Protection",
    text: "Every booking includes platform liability coverage up to $50,000 for equipment and property.",
    icon: "shield",
  },
  {
    title: "Verified Host Profiles",
    text: "ID and studio ownership are checked before a listing goes live — you know who holds the keys.",
    icon: "badge",
  },
  {
    title: "Equipment Safety",
    text: "Damage deposits and post-session checklists keep gear, cyc walls and consoles in shooting shape.",
    icon: "camera",
  },
  {
    title: "24/7 Host Support",
    text: "A real human on call around the clock — from load-in questions to after-hours access.",
    icon: "headphones",
  },
] as const;

export const HERO_SLIDES = [
  {
    image:
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1920&q=80",
    eyebrow: "Photography & Film",
    title: "Roll camera in studios built for the shot",
    text: "Book cyclorama walls, daylight bays and cinema sound stages by the hour — inspected, insured and ready for your call sheet.",
    stat: "1,200+ spaces",
  },
  {
    image:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1920&q=80",
    eyebrow: "Audio & Podcasting",
    title: "Track, mix and go live in treated rooms",
    text: "Analog consoles, iso booths and broadcast-ready podcast lounges with mics, monitors and an engineer on call.",
    stat: "480+ suites",
  },
  {
    image:
      "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=1920&q=80",
    eyebrow: "Hosts & Creators",
    title: "Turn your empty space into steady income",
    text: "List your studio, set your own hourly rate and calendar — we handle bookings, deposits and guest support.",
    stat: "$96 / hr avg.",
  },
];

export const FOOTER_CATEGORIES = [
  "Photo Studios",
  "Sound Stages",
  "Podcast Rooms",
  "Music Suites",
  "Art Workshops",
];

export const TESTIMONIALS = [
  {
    name: "Amara Okafor",
    role: "Commercial Photographer",
    quote:
      "We shot an entire lookbook on a StudioSpace cyc wall in Greenpoint. Check-in took ninety seconds and the C-stands were already placed.",
    avatar:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=200&q=80",
  },
  {
    name: "Diego Marín",
    role: "Podcast Producer",
    quote:
      "Our weekly show rents the same treated lounge every Tuesday. Booking is locked in, the mics stay patched — it feels like our own studio.",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
  },
  {
    name: "Priya Raghavan",
    role: "Independent Musician",
    quote:
      "I tracked vocals in a music suite with a real vocal booth for less than the cost of an afternoon at a big-name facility. Host was incredible.",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
  },
];
