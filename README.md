# StudioSpace — Creative Spaces for Creators

StudioSpace is a peer-to-peer creative workspace and production studio sharing platform. It helps photographers, filmmakers, podcasters, musicians, and other creators discover and reserve creative spaces. Studio owners can publish their studios and manage their listings.

## Live Website

- **Live site:** [Add your deployed client URL]
- **Client repository:** [Add your client GitHub repository URL]
- **Server repository:** [Add your server GitHub repository URL]

## Features

- **Explore creative spaces:** Browse available photography studios, film stages, podcast rooms, music suites, and art workshops.
- **Search and filter:** Find studios by category or search by studio title, location, and category.
- **Featured studios:** Discover featured studios selected by rating and review count.
- **Studio details:** View a studio's images, category, hourly rate, security deposit, capacity, location, amenities, and overview.
- **Authentication:** Register and sign in to access account-specific features. Google sign-in is supported when configured.
- **Host studio management:** Authenticated hosts can add a studio, view their listings, update studio information, and remove a listing.
- **Studio bookings:** Customers can request a studio reservation and view their booking status from My Bookings.
- **Booking cancellation:** Customers can cancel eligible pending bookings.
- **Responsive interface:** The application is designed for desktop, tablet, and mobile screens.
- **User feedback and loading states:** Toast notifications and loading/empty states help users understand what is happening.

> Keep this feature list aligned with what is actually implemented and working in your deployed version.

## Technology Stack

### Client

- **Next.js** — App Router and React-based application framework
- **React** — Component-based user interface
- **TypeScript** — Type safety
- **Tailwind CSS** — Styling and responsive layouts
- **shadcn/ui** — Reusable interface components
- **Better Auth** — Authentication (with the configured database adapter and providers)
- **Sonner** — Toast notifications
- **Lucide React** — Icons

### API and database

- **Express.js** — Backend REST API
- **MongoDB** — Stores studio and booking data

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
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_IMGBB_API_KEY=YOUR_IMGBB_API_KEY
```

- `NEXT_PUBLIC_API_URL` is the base URL of the Express backend. The local example assumes the backend runs on port `5000`.
- `NEXT_PUBLIC_IMGBB_API_KEY` is used by the client image-upload feature. A `NEXT_PUBLIC_` variable is exposed to the browser, so do not put private or sensitive secrets in it.
- Add any other Better Auth environment variables required by the authentication configuration. Keep server-side secrets out of `NEXT_PUBLIC_` variables.

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> Restart the Next.js development server after changing `.env.local`.

## Run the Backend

The client needs the Express API to be running when using real MongoDB data.

1. Start the server project in a separate terminal, following the server repository's setup instructions.
2. Configure the backend's MongoDB connection string and allowed client origin in its environment file.
3. Make sure the backend is available at the URL configured in `NEXT_PUBLIC_API_URL`.

The client API helper uses these endpoints:

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/studios` | Get studios; supports category and search query parameters |
| GET | `/api/studios/:id` | Get one studio |
| POST | `/api/studios` | Create a studio |
| PUT | `/api/studios/:id` | Update a studio |
| DELETE | `/api/studios/:id` | Delete a studio |
| GET | `/api/studios/:id/reviews` | Get studio reviews |
| GET | `/api/bookings?userEmail=...` | Get a user's bookings |
| POST | `/api/bookings` | Create a booking |
| PATCH | `/api/bookings/:id` | Update a booking, including cancellation |

## Build for Production

Run the production build locally:

```bash
npm run build
```

If the build succeeds, start the production server with:

```bash
npm run start
```

These commands assume the corresponding scripts are defined in `package.json`.

## Deployment

The client can be deployed to a platform such as Vercel.

1. Import the client GitHub repository into Vercel.
2. Configure the production environment variables, especially `NEXT_PUBLIC_API_URL` and the image-upload configuration.
3. Deploy the Express backend separately and use its deployed HTTPS URL for `NEXT_PUBLIC_API_URL`.
4. Configure the backend CORS origin to allow the deployed client domain.
5. Add the production environment variables required by Better Auth and configure its production URL and trusted origins according to the authentication setup.
6. Test direct navigation and page refreshes on routes such as `/studios`, `/studios/[id]`, `/my-listings`, and `/my-bookings`.

## Examiner Test Credentials

Add a test account that the examiner can use. Do not publish a real personal account password.

| Field | Value |
|---|---|
| Test email | `[Add examiner test email]` |
| Test password | `[Add examiner test password]` |
| Login method | Email/password; Google sign-in if configured |

Make sure this test account exists and can sign in before submitting the project.

## Project Notes

- The client uses `NEXT_PUBLIC_API_URL` to connect to the backend API.
- If the API URL is empty, the current API helper can use local seed data instead of the real backend.
- Never commit `.env.local`, backend `.env` files, database credentials, or private authentication secrets to GitHub.
- Confirm that all listed features work on the deployed site before submitting the README.
