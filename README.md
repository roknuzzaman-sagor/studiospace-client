# StudioSpace 🎬

**Peer-to-peer creative workspace rental — book photo studios, sound stages, podcast rooms, music suites and art workshops by the hour.**

**Live URL:** https://studiospace-client.vercel.app
**Server repo (Express + MongoDB):** https://github.com/RoknuzzamanSagor/studiospace-server

## ✨ Features

- **Cinematic Spotlight UI** — custom dark/light design system (tungsten amber + teal signal accents, film grain, viewfinder brackets, beam-sweep CTAs) with a one-tap **theme toggle** and Bricolage Grotesque display type.
- **Full auth flow** — Login (show/hide password, Forgot Password link, Google button) and Register with a **live password checklist** (uppercase + lowercase + ≥6 chars). Session restores before any redirect, so **reloading a private page as a logged-in user never bounces you to /login**.
- **Complete studio CRUD** — Add, Read, Update, Delete listings with owner-only guards, imgbb image upload + live preview, amenity tag picker, read-only host info, and a custom confirm dialog on delete.
- **Booking system** — booking modal with live hour/total calculation, status badges (Pending / Confirmed / Completed / Cancelled), and cancel-only-when-pending rules. The server rejects **double-booked time slots** (Challenge 2).
- **Explore page** — debounced search, category/price/sort filters, `?category=` deep links from the home page's category cards, branded skeletons and helpful empty states with CTAs.
- **Rich home page** — Swiper hero slider (3 slides → /studios), 6 featured studios from the DB, 5 category cards, 4-step "How Booking Works", Host Guarantee and testimonials.
- **Studio details** — thumbnail-driven Swiper gallery, amenities, verified host card, reviews with star ratings, sticky booking card, wishlist heart.
- **Personal dashboards** — Dashboard with stats, My Studio Listings, My Bookings, all behind a protected route gate.
- **No `alert()`/`confirm()` anywhere** — every message is a Sonner toast or a styled modal dialog; custom 404 with studio illustration; responsive layout on mobile → desktop.

## 🛠 Tech Stack

- **Next.js 16 (App Router) + TypeScript**, `cacheComponents` + partial prefetching
- **shadcn/ui (Base UI)**, Tailwind CSS v4, **Swiper.js**, Lucide icons
- **Sonner** toasts · **next-themes** light/dark · **BetterAuth** client
- **Express + MongoDB** backend (separate repo) with **JWT stored in HTTPOnly cookies** (Challenge 1)

## 🖥 Local Setup

```bash
git clone https://github.com/RoknuzzamanSagor/studiospace-client.git
cd studiospace-client
npm install
cp .env.example .env.local   # optional — leave empty to run in demo mode
npm run dev                  # http://localhost:3000
```

- **Demo mode (default):** `NEXT_PUBLIC_API_URL` empty → seeded studios/bookings + localStorage auth, so the whole site is reviewable with no backend.
- **Live mode:** set `NEXT_PUBLIC_API_URL` (and optionally `NEXT_PUBLIC_IMGBB_API_KEY`) → BetterAuth + real MongoDB data.

Production build: `npm run build && npm start`.

## 🔑 Examiner Test Credentials (demo mode)

| Role    | Email                    | Password       | What to test                                             |
| ------- | ------------------------ | -------------- | -------------------------------------------------------- |
| Creator | `examiner@studiospace.dev` | `Examiner@123` | My Bookings (seeded reservations), book a new studio     |
| Host    | `host@studiospace.dev`     | `Host@123456`  | Dashboard, My Studio Listings, Add/Update/Delete studio  |

> Or click **"Continue with Google"** on the Login page — in demo mode it signs you in instantly as `examiner@studiospace.dev`. New accounts can also be registered (password needs uppercase, lowercase and 6+ characters).

## 📄 Pages

`/` Home · `/studios` Explore · `/studios/[id]` Details · `/login` · `/register` · `/dashboard` · `/add-studio` · `/studios/edit/[id]` · `/my-listings` · `/my-bookings` · `/how-it-works` · `/about` · `/terms` · `/privacy` · `/cancellation` · custom 404
