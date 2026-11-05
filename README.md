# StudioSpace — Creative Spaces for Creators

StudioSpace is a peer-to-peer creative workspace and production studio sharing platform. It helps photographers, filmmakers, podcasters, musicians, and other creators discover and reserve creative spaces. Studio owners can publish their studios and manage their listings.

## Live Website

- **Live site:** [https://studiospace-client.vercel.app]
- **Client repository:** [https://github.com/roknuzzaman-sagor/studiospace-client]
- **Server repository:** [https://github.com/roknuzzaman-sagor/studiospace-server]

## Features

- **Explore creative spaces:** Browse available photography studios, film stages, podcast rooms, music suites, and art workshops.
- **Search and filter:** Find studios by category, price band, and sort order, with debounced search across studio title, location, and category.
- **Featured studios:** Discover featured studios selected by rating and review count.
- **Studio details:** View a studio's images, category, hourly rate, security deposit, capacity, location, amenities, and overview.
- **Authentication:** Register and sign in with email/password. Google sign-in and Google sign-up are supported with the Google Identity credential flow and HTTPOnly JWT cookies.
- **Wishlist:** Save studios to a server-backed wishlist and revisit them from Saved Studios.
- **Host studio management:** Authenticated hosts can add a studio, view their listings, update studio information, and remove a listing.
- **Studio bookings:** Customers can request a studio reservation and view their booking status from My Bookings.
- **Booking cancellation:** Customers can cancel eligible bookings.
- **Responsive interface:** The application is designed for desktop, tablet, and mobile screens.
- **User feedback and loading states:** Toast notifications, skeleton loaders, and empty states help users understand what is happening.

## Technology Stack

### Client

- **Next.js** — App Router and React-based application framework
- **React** — Component-based user interface
- **TypeScript** — Type safety
- **Tailwind CSS** — Styling and responsive layouts
- **shadcn/ui** — Reusable interface components
- **axios** — HTTP client with `withCredentials` for the HTTPOnly JWT cookie
- **@react-oauth/google** — Google sign-in credential flow
- **Sonner** — Toast notifications
- **Lucide React** — Icons

### API and database

- **Express.js** — Backend REST API
- **MongoDB** — Stores studio, booking, wishlist, and user data

## Run the Client Locally

### 1. Clone the client repository

```bash
git clone <CLIENT_REPOSITORY_URL>
```

### 2. Open the client project folder

```bash
cd <CLIENT_PROJECT_FOLDER>
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env.local` file in the client project's root directory (the same directory as `package.json`). Add the required values:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
NEXT_PUBLIC_IMGBB_API_KEY=YOUR_IMGBB_API_KEY
```

- `NEXT_PUBLIC_API_URL` is the base URL of the Express backend **including `/api`**. The local example assumes the backend runs on port `5000`.
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` enables the Google sign-in and sign-up buttons. **It must match the server's `GOOGLE_CLIENT_ID`.** Add `http://localhost:3000` to the authorized JavaScript origins in Google Cloud Console. Without it, the buttons explain that Google sign-in is not configured.
- `NEXT_PUBLIC_IMGBB_API_KEY` is used by the client image-upload feature. A `NEXT_PUBLIC_` variable is exposed to the browser, so do not put private or sensitive secrets in it. The uploaded image URL is what gets stored in MongoDB.
- Keep server-side secrets out of `NEXT_PUBLIC_` variables.

### Server environment variables

The Express server keeps its own `.env` (never commit it). These are the values it needs:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# MongoDB connection string (Atlas or a local MongoDB)
MONGO_URI=mongodb://127.0.0.1:27017/studiospace
# or Atlas:
# MONGO_URI=mongodb+srv://USER:PASSWORD@cluster.mongodb.net/studiospace?retryWrites=true&w=majority

# Auth
JWT_SECRET=replace-with-a-long-random-string
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
```

- `CLIENT_URL` controls CORS. It must be the exact browser origin (`http://localhost:3000` locally, your Vercel URL in production).
- `GOOGLE_CLIENT_ID` must be identical to the client's `NEXT_PUBLIC_GOOGLE_CLIENT_ID`.
- `JWT_SECRET` signs the HTTPOnly `token` cookie. Use a long random value and keep it server-side only.
- In production set `NODE_ENV=production` so cookies are issued with `Secure` + `SameSite=None` for cross-site use, and set `CLIENT_URL` to the deployed client origin.
- **Database name:** the server connects with `dbName: process.env.MONGODB_DB || "studiospace"`, so `MONGODB_DB=studiospace` in the server `.env` is enough even when `MONGO_URI` has no database path. Keeping the name explicit avoids writing to Mongoose's default `test` database.

### Seed studio data

The server ships an idempotent seeder that writes real studio listings, reviews and a host account to MongoDB:

```bash
cd <server-folder>
npm run seed
```

The seeder uses the same `MONGODB_DB` database as the API. It creates a host account (`host@studiospace.dev` / `Host@123456`), 12 studios and reviews for each studio. Re-running it updates the seed data without creating duplicates.

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> Restart the Next.js development server after changing `.env.local`.

## Run the Backend

The client requires the Express API to be running.

1. Start the server project in a separate terminal, following the server repository's setup instructions.
2. Configure the backend's MongoDB connection string and allowed client origin in its environment file.
3. Make sure the backend is available at the URL configured in `NEXT_PUBLIC_API_URL`.

The client API layer uses these endpoints:

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Register a new account |
| POST | `/api/auth/login` | Sign in with email and password |
| POST | `/api/auth/google` | Sign in with a Google credential |
| POST | `/api/auth/logout` | Clear the session cookie |
| GET | `/api/auth/me` | Restore the signed-in user on reload |
| GET | `/api/studios` | Get studios; supports `category`, `search`, `sort`, `minRate`, `maxRate`, and `limit` |
| GET | `/api/studios/featured` | Get featured studios |
| GET | `/api/studios/my-listings` | Get studios owned by the signed-in user |
| GET | `/api/studios/:id` | Get one studio |
| GET | `/api/studios/:id/reviews` | Get reviews for a studio |
| POST | `/api/studios/:id/reviews` | Add a review (signed-in users) |
| POST | `/api/studios` | Create a studio |
| PUT | `/api/studios/:id` | Update a studio |
| DELETE | `/api/studios/:id` | Delete a studio |
| GET | `/api/bookings/my-bookings` | Get the signed-in user's bookings |
| POST | `/api/bookings` | Create a booking (returns `409` for overlapping confirmed bookings) |
| PATCH | `/api/bookings/:id/cancel` | Cancel a booking |
| GET | `/api/wishlist` | Get the signed-in user's saved studios |
| GET | `/api/wishlist/check/:studioId` | Check whether a studio is saved |
| POST | `/api/wishlist` | Save a studio |
| DELETE | `/api/wishlist/:studioId` | Remove a saved studio |

## Build for Production

Run the production build locally:

```bash
npm run build
```

If the build succeeds, start the production server with:

```bash
npm run start
```

## Deployment

The client can be deployed to a platform such as Vercel.

1. Import the client GitHub repository into Vercel.
2. Configure the production environment variables: `NEXT_PUBLIC_API_URL` (with `/api`), `NEXT_PUBLIC_GOOGLE_CLIENT_ID`, and `NEXT_PUBLIC_IMGBB_API_KEY`.
3. Deploy the Express backend separately and use its deployed HTTPS URL for `NEXT_PUBLIC_API_URL`.
4. Configure the backend CORS origin to allow the deployed client domain and allow credentials so the JWT cookie is sent.
5. Add the deployed client domain to the Google OAuth authorized origins.
6. Test direct navigation and page refreshes on routes such as `/studios`, `/studios/[id]`, `/saved-studios`, `/my-listings`, and `/my-bookings`.

## Examiner Test Credentials

The client was verified end-to-end against the running Express API with this account:

| Field | Value |
|---|---|
| Test email | `examiner@studiospace.test` |
| Test password | `Examiner123` |
| Login method | Email/password; Google sign-in/sign-up if configured |

Make sure this account still exists and can sign in before submitting the project.

## How Data Reaches MongoDB

The client never talks to MongoDB directly; it only calls the Express API. Every write below is persisted by the server through Mongoose:

| User action | Client request | MongoDB collection |
|---|---|---|
| Register | `POST /api/auth/register` | `users` (bcrypt password hash) |
| Login / reload / Google | `POST /api/auth/login`, `GET /api/auth/me`, `POST /api/auth/google` | `users` (+ HTTPOnly JWT cookie) |
| Explore / featured / details | `GET /api/studios`, `/featured`, `/:id` | `studios` |
| Add / edit / delete studio | `POST/PUT/DELETE /api/studios` | `studios` |
| Book a studio | `POST /api/bookings` | `bookings` |
| View / cancel bookings | `GET /api/bookings/my-bookings`, `PATCH /api/bookings/:id/cancel` | `bookings` |
| Save / remove wishlist | `POST/DELETE /api/wishlist` | `wishlists` |

Seeder data, if used, is inserted by the server; the client ships no mock data and stores no user data in `localStorage`. The only local storage left is the theme preference handled by `next-themes`, which is unrelated to accounts or app data.

## Project Notes

- All data comes from the Express API through the single axios instance in `src/lib/api.ts`; no seed or mock data is bundled.
- Authentication uses HTTPOnly JWT cookies. The browser never stores the token, and `withCredentials: true` must stay enabled on the API client.
- Never commit `.env.local`, backend `.env` files, database credentials, or private authentication secrets to GitHub.
- Confirm that all listed features work on the deployed site before submitting the README.
