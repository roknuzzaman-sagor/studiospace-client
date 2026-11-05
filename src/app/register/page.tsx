"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { toast } from "sonner";
import {
  CheckIcon,
  EyeIcon,
  EyeOffIcon,
  Loader2Icon,
  XIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApertureMark } from "@/components/shared/logo";
import { GoogleIcon } from "@/components/shared/google-icon";
import { useAuth, validatePassword } from "@/lib/auth";
import { getErrorMessage } from "@/lib/errors";

const RULES = [
  { test: (v: string) => /[A-Z]/.test(v), label: "One uppercase letter" },
  { test: (v: string) => /[a-z]/.test(v), label: "One lowercase letter" },
  { test: (v: string) => v.length >= 6, label: "At least 6 characters" },
];

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export default function RegisterPage() {
  const router = useRouter();
  const { register, googleLogin } = useAuth();

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [photoURL, setPhotoURL] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [googleLoading, setGoogleLoading] = React.useState(false);

  const passwordError = password ? validatePassword(password) : null;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim() || !email.trim()) {
      toast.error("Please fill in your name and email.");
      return;
    }
    if (!photoURL.trim()) {
      toast.error("Please add a photo URL for your avatar.");
      return;
    }
    const invalid = validatePassword(password);
    if (invalid) {
      toast.error(invalid);
      return;
    }

    setSubmitting(true);
    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        photoURL: photoURL.trim(),
        password,
      });
      toast.success("Account created — sign in to start booking.");
      router.push("/login");
    } catch (err) {
      toast.error(getErrorMessage(err, "Registration failed"));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogleSuccess(response: CredentialResponse) {
    if (!response.credential) {
      toast.error("Google did not return a sign-in credential.");
      return;
    }

    setGoogleLoading(true);
    try {
      await googleLogin(response.credential);
      toast.success("Account ready — you're signed in with Google.");
      router.push("/");
    } catch (err) {
      toast.error(getErrorMessage(err, "Google sign-up failed"));
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <div className="spotlight relative flex min-h-[calc(100vh-4rem)] items-center justify-center px-5 py-14 sm:px-10">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card/80 p-6 shadow-[0_30px_80px_-50px_oklch(0_0_0/0.7)] backdrop-blur sm:p-8">
        <Link href="/" className="mb-8 inline-flex items-center gap-2.5">
          <ApertureMark className="size-9 text-primary" />
          <span className="font-heading text-lg font-extrabold tracking-tight">
            Studio<span className="text-primary">Space</span>
          </span>
        </Link>

        <span className="eyebrow text-primary">Join the platform</span>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
          Create your account
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          One account for booking studios, listing your own space and keeping
          every receipt in order.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className="h-11 rounded-lg px-4"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="reg-email">Email</Label>
            <Input
              id="reg-email"
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
            <Label htmlFor="photo">Photo URL</Label>
            <Input
              id="photo"
              type="url"
              value={photoURL}
              onChange={(e) => setPhotoURL(e.target.value)}
              placeholder="https://…/your-avatar.jpg"
              className="h-11 rounded-lg px-4"
            />
            <p className="text-xs text-muted-foreground">
              Used as your avatar in bookings and listing ownership.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="reg-password">Password</Label>
            <div className="relative">
              <Input
                id="reg-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                aria-invalid={password ? !!passwordError : undefined}
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

            {/* Live validation checklist */}
            <ul className="mt-1 flex flex-col gap-1.5">
              {RULES.map((rule) => {
                const passed = rule.test(password);
                return (
                  <li
                    key={rule.label}
                    className={`flex items-center gap-2 text-xs transition-colors ${
                      passed
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-muted-foreground"
                    }`}
                  >
                    <span
                      className={`flex size-4 items-center justify-center rounded-full border ${
                        passed
                          ? "border-emerald-500 bg-emerald-500 text-white"
                          : "border-border"
                      }`}
                    >
                      {passed ? (
                        <CheckIcon className="size-2.5" />
                      ) : (
                        <XIcon className="size-2.5 text-muted-foreground/60" />
                      )}
                    </span>
                    {rule.label}
                  </li>
                );
              })}
            </ul>
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="beam mt-1 h-11 w-full rounded-full text-base font-bold shadow-[0_14px_30px_-16px_oklch(0.76_0.155_62)]"
          >
            {submitting ? (
              <>
                <Loader2Icon className="size-4 animate-spin" />
                Creating account…
              </>
            ) : (
              "Register"
            )}
          </Button>
        </form>

        <div className="mt-5 flex items-center gap-3" aria-hidden>
          <span className="h-px flex-1 bg-border" />
          <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            or
          </span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <div className="relative mt-4">
          <Button
            type="button"
            variant="outline"
            disabled={googleLoading}
            onClick={
              googleClientId
                ? undefined
                : () =>
                    toast.error(
                      "Google sign-in isn't configured for this build.",
                    )
            }
            className="h-11 w-full gap-2.5 rounded-full text-sm font-semibold"
          >
            {googleLoading ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : (
              <GoogleIcon />
            )}
            Sign up with Google
          </Button>
          {googleClientId ? (
            <div className="absolute inset-0 z-10 overflow-hidden rounded-full opacity-0 [&>div]:!w-full [&_iframe]:!w-full">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error("Google sign-up failed")}
                width="400"
                text="continue_with"
                shape="pill"
              />
            </div>
          ) : null}
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-primary underline-offset-4 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
