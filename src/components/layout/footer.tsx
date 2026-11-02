"use client";

import * as React from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/shared/logo";
import { useMounted } from "@/hooks/use-mounted";
import { FOOTER_CATEGORIES } from "@/lib/constants";

const QUICK_LINKS = [
  { href: "/", label: "Home" },
  { href: "/studios", label: "Explore Studios" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#about", label: "About Us" },
  { href: "/add-studio", label: "Host Your Space" },
];

const LEGAL_LINKS = [
  { href: "/terms", label: "Terms of Service" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/cancellation", label: "Cancellation Policy" },
];

/** New X (formerly Twitter) logo — the X glyph, not the old bird. */
function XLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  {
    label: "X (Twitter)",
    href: "https://x.com",
    icon: "x" as const,
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: "instagram" as const,
  },
  {
    label: "YouTube",
    href: "https://youtube.com",
    icon: "youtube" as const,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: "linkedin" as const,
  },
];

function SocialIcon({ icon, className }: { icon: string; className?: string }) {
  if (icon === "x") return <XLogo className={className ?? "size-4"} />;
  if (icon === "instagram")
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className ?? "size-4"}>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    );
  if (icon === "youtube")
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className ?? "size-4"}>
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    );
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className ?? "size-4"}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
    </svg>
  );
}

export function Footer() {
  const [email, setEmail] = React.useState("");
  // Date() only runs client-side: useMounted is false during prerender, so the
  // build never sees an unstable value and the year is correct after hydration.
  const mounted = useMounted();
  const year = mounted ? String(new Date().getFullYear()) : "2026";

  function handleNewsletter(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    toast.success("You're on the list — shoot notes are headed your way.");
    setEmail("");
  }

  return (
    <footer id="about" className="relative mt-auto border-t border-border bg-card/60">
      {/* Newsletter band */}
      <div className="section-pad grid gap-8 border-b border-border py-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
        <div>
          <h3 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            Get new studios before anyone else
          </h3>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            A fortnightly dispatch of freshly listed cyc walls, sound stages and
            podcast lounges — plus host tips and off-peak rate drops. No spam,
            unsubscribe anytime.
          </p>
        </div>
        <form
          onSubmit={handleNewsletter}
          className="flex w-full gap-2"
          aria-label="Newsletter signup"
        >
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@studio.com"
            aria-label="Email address"
            className="h-11 flex-1 rounded-full bg-background px-5"
          />
          <Button
            type="submit"
            className="beam h-11 shrink-0 gap-1.5 rounded-full px-6 font-semibold"
          >
            Subscribe
            <ArrowRightIcon className="size-4" />
          </Button>
        </form>
      </div>

      {/* Main footer grid */}
      <div className="section-pad grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-4">
          <Logo />
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            StudioSpace is a peer-to-peer marketplace where creators rent the
            exact room their project needs — by the hour, with transparent
            pricing and hosts who actually answer.
          </p>
          <div className="flex items-center gap-2">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="flex size-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-primary hover:text-primary"
              >
                <SocialIcon icon={social.icon} />
              </a>
            ))}
          </div>
        </div>

        <nav aria-label="Quick links" className="flex flex-col gap-3">
          <h4 className="eyebrow text-primary">Quick Links</h4>
          <ul className="flex flex-col gap-2.5">
            {QUICK_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Popular categories" className="flex flex-col gap-3">
          <h4 className="eyebrow text-primary">Popular Categories</h4>
          <ul className="flex flex-col gap-2.5">
            {FOOTER_CATEGORIES.map((label) => (
              <li key={label}>
                <Link
                  href={`/studios?category=${label.toLowerCase().replace(/\s+/g, "-")}`}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col gap-3">
          <h4 className="eyebrow text-primary">Legal</h4>
          <ul className="flex flex-col gap-2.5">
            {LEGAL_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Questions?{" "}
            <a
              href="mailto:hello@studiospace.dev"
              className="text-primary underline-offset-4 hover:underline"
            >
              hello@studiospace.dev
            </a>
          </p>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="border-t border-border">
        <div className="section-pad flex flex-col items-center justify-between gap-3 py-5 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {year} StudioSpace. All rights reserved.
          </p>
          <p className="text-center sm:text-right">
            Built for creators, hosts and everyone between the cue light and the
            clapper.
          </p>
        </div>
      </div>
    </footer>
  );
}
