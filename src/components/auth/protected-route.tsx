"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/lib/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Wraps private routes. Waits for the session to finish restoring before
 * deciding anything, so a hard reload of a private route never bounces a
 * logged-in user back to /login.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div
        className="section-pad flex min-h-[50vh] flex-col items-center justify-center gap-4"
        role="status"
        aria-label="Checking your session"
      >
        <span className="relative flex size-14 items-center justify-center">
          <span
            aria-hidden
            className="absolute inset-0 animate-spin rounded-full border-2 border-primary/25 border-t-primary"
          />
          <Spinner className="size-5 text-primary" />
        </span>
        <p className="eyebrow text-muted-foreground">Verifying your session…</p>
      </div>
    );
  }

  // Still resolving, or confirmed signed out (redirect happens in the effect)
  if (!user) return null;

  return <>{children}</>;
}
