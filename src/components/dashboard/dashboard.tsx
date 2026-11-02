"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import {
  CalendarCheckIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  PlusIcon,
  CameraIcon,
  WalletIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SectionHeading } from "@/components/shared/section-heading";
import { StatusBadge } from "@/components/shared/status-badge";
import { fetchBookings, fetchStudios } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { Booking, Studio } from "@/lib/types";

export function Dashboard() {
  const { user, logout } = useAuth();
  const [studios, setStudios] = React.useState<Studio[]>([]);
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      try {
        const [allStudios, myBookings] = await Promise.all([
          fetchStudios(),
          fetchBookings(user.email),
        ]);
        if (cancelled) return;
        setStudios(allStudios.filter((s) => s.ownerEmail === user.email));
        setBookings(myBookings);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const pending = bookings.filter((b) => b.status === "Pending").length;
  const confirmed = bookings.filter((b) => b.status === "Confirmed").length;
  const spend = bookings
    .filter((b) => b.status !== "Cancelled")
    .reduce((sum, b) => sum + b.totalAmount, 0);
  const earnings = studios.reduce((sum, s) => sum + s.hourlyRate, 0);

  const stats = [
    {
      label: "My Listings",
      value: studios.length,
      icon: CameraIcon,
      accent: "text-primary bg-primary/12",
    },
    {
      label: "Active Bookings",
      value: pending + confirmed,
      icon: CalendarCheckIcon,
      accent: "text-signal bg-signal/12",
    },
    {
      label: "Total Spend",
      value: `$${spend}`,
      icon: WalletIcon,
      accent: "text-emerald-600 bg-emerald-500/12",
    },
    {
      label: "Avg. Rate / hr",
      value: studios.length ? `$${Math.round(earnings / studios.length)}` : "—",
      icon: LayoutDashboardIcon,
      accent: "text-violet-600 bg-violet-500/12",
    },
  ];

  return (
    <div className="section-pad py-10 sm:py-14">
      {/* Profile header */}
      <div className="grain relative overflow-hidden rounded-2xl border border-border bg-card">
        <div className="spotlight absolute inset-0" aria-hidden />
        <div className="relative z-10 flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="size-16 ring-4 ring-primary/30">
              <AvatarImage src={user.photoURL} alt={user.name} />
              <AvatarFallback className="bg-primary/15 text-lg font-extrabold text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <span className="eyebrow text-primary">Creator Dashboard</span>
              <h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">
                Welcome back, {user.name.split(" ")[0]}
              </h1>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              render={<Link href="/add-studio" />}
              nativeButton={false}
              className="beam h-10 gap-1.5 rounded-full px-5 font-semibold"
            >
              <PlusIcon className="size-4" />
              Add New Studio
            </Button>
            <Button
              variant="outline"
              onClick={async () => {
                await logout();
                toast.success("Signed out — see you on the next shoot.");
              }}
              className="h-10 gap-1.5 rounded-full px-5 font-semibold"
            >
              <LogOutIcon className="size-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))
          : stats.map((stat) => (
              <div
                key={stat.label}
                className="card-hover rounded-xl border border-border bg-card p-5"
              >
                <span
                  className={`flex size-10 items-center justify-center rounded-lg ${stat.accent}`}
                >
                  <stat.icon className="size-5" />
                </span>
                <p className="mt-3 text-2xl font-extrabold tracking-tight">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {/* Recent bookings */}
        <section className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight">
              Recent bookings
            </h2>
            <Link
              href="/my-bookings"
              className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
            >
              View all
            </Link>
          </div>

          {loading ? (
            <div className="mt-4 flex flex-col gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full rounded-lg" />
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <div className="mt-4 flex flex-col items-center gap-3 rounded-lg border border-dashed border-border py-8 text-center">
              <p className="text-sm text-muted-foreground">
                No bookings yet — your reservations will appear here.
              </p>
              <Button
                render={<Link href="/studios" />}
                nativeButton={false}
                variant="outline"
                className="h-9 rounded-full px-5 text-sm"
              >
                Explore Studios
              </Button>
            </div>
          ) : (
            <ul className="mt-4 flex flex-col gap-3">
              {bookings.slice(0, 4).map((b) => (
                <li
                  key={b._id}
                  className="flex items-center gap-3 rounded-lg border border-border bg-background p-3"
                >
                  <div className="relative size-12 shrink-0 overflow-hidden rounded-md bg-muted">
                    <Image
                      src={b.studioImage}
                      alt={b.studioTitle}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {b.studioTitle}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {b.date} · {b.startTime}–{b.endTime}
                    </p>
                  </div>
                  <StatusBadge status={b.status} />
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* My listings */}
        <section className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight">
              My studio listings
            </h2>
            <Link
              href="/my-listings"
              className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
            >
              View all
            </Link>
          </div>

          {loading ? (
            <div className="mt-4 flex flex-col gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full rounded-lg" />
              ))}
            </div>
          ) : studios.length === 0 ? (
            <div className="mt-4 flex flex-col items-center gap-3 rounded-lg border border-dashed border-border py-8 text-center">
              <p className="text-sm text-muted-foreground">
                You haven&apos;t listed a space yet.
              </p>
              <Button
                render={<Link href="/add-studio" />}
                nativeButton={false}
                variant="outline"
                className="h-9 rounded-full px-5 text-sm"
              >
                Add New Studio
              </Button>
            </div>
          ) : (
            <ul className="mt-4 flex flex-col gap-3">
              {studios.slice(0, 4).map((s) => (
                <li
                  key={s._id}
                  className="flex items-center gap-3 rounded-lg border border-border bg-background p-3"
                >
                  <div className="relative size-12 shrink-0 overflow-hidden rounded-md bg-muted">
                    <Image
                      src={s.imageUrl}
                      alt={s.title}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{s.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {s.location}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-extrabold text-primary">
                    ${s.hourlyRate}
                    <span className="text-xs font-normal text-muted-foreground">
                      /hr
                    </span>
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
