"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { EyeIcon, EyeOffIcon, Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApertureMark } from "@/components/shared/logo";
import { useAuth } from "@/lib/auth";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-4">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, loginWithGoogle } = useAuth();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [googleLoading, setGoogleLoading] = React.useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim() || !password) {
      toast.error("Please fill in both email and password.");
      return;
    }

    setSubmitting(true);
    try {
      await login(email.trim(), password);
      toast.success("Welcome back — you're signed in.");
      const next = searchParams.get("next");
      router.push(next && next.startsWith("/") ? next : "/");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Unable to sign in right now.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      toast.success("Signed in with Google.");
      router.push("/");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Google sign-in failed.",
      );
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      {/* Form side */}
      <div className="spotlight relative flex items-center justify-center px-5 py-14 sm:px-10">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-8 inline-flex items-center gap-2.5">
            <ApertureMark className="size-9 text-primary" />
            <span className="font-heading text-lg font-extrabold tracking-tight">
              Studio<span className="text-primary">Space</span>
            </span>
          </Link>

          <span className="eyebrow text-primary">Welcome back</span>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Sign in to your account
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Pick up where you left off — bookings, listings and saved studios
            are one tap away.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@studio.com"
                className="h-11 rounded-lg px-4"
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button
                  type="button"
                  onClick={() =>
                    toast.info(
                      "Password reset isn't enabled for this build — contact hello@studiospace.dev.",
                    )
                  }
                  className="text-xs font-medium text-primary underline-offset-4 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-11 rounded-lg pr-11 pl-4"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOffIcon className="size-4" />
                  ) : (
                    <EyeIcon className="size-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="beam h-11 w-full rounded-full text-base font-bold shadow-[0_14px_30px_-16px_oklch(0.76_0.155_62)]"
            >
              {submitting ? (
                <>
                  <Loader2Icon className="size-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-border" />
            <span className="eyebrow text-muted-foreground">or</span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleGoogle}
            disabled={googleLoading}
            className="h-11 w-full gap-2.5 rounded-full text-sm font-semibold"
          >
            {googleLoading ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : (
              <GoogleIcon />
            )}
            Continue with Google
          </Button>

          <p className="mt-7 text-center text-sm text-muted-foreground">
            Don&apos;t have an account yet?{" "}
            <Link
              href="/register"
              className="font-semibold text-primary underline-offset-4 hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </div>

      {/* Visual side */}
      <div className="grain relative hidden overflow-hidden bg-[oklch(0.15_0.012_255)] lg:block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1400&q=80"
          alt="Film crew working on a lit studio set"
          className="absolute inset-0 size-full object-cover opacity-70"
        />
        <div className="hero-scrim absolute inset-0" />
        <span className="vf-outer absolute inset-6 !text-white/45">
          <span className="vf-inner !text-white/45" />
        </span>

        <div className="relative z-10 flex h-full flex-col justify-end p-10">
          <blockquote className="max-w-md">
            <p className="text-2xl leading-snug font-bold text-white text-balance">
              “We booked a treated podcast lounge for our Tuesday episodes and
              it feels like our own studio now.”
            </p>
            <footer className="mt-4 flex items-center gap-3">
              <Image
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
                alt=""
                width={40}
                height={40}
                className="size-10 rounded-full object-cover ring-2 ring-primary"
              />
              <div>
                <p className="text-sm font-bold text-white">Diego Marín</p>
                <p className="text-xs text-white/70">Podcast Producer</p>
              </div>
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
}
