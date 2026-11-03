"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDownIcon, MenuIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Logo } from "@/components/shared/logo";
import { useAuth } from "@/lib/auth";
import { useMounted } from "@/hooks/use-mounted";
import { toast } from "sonner";
import { cn } from "cn";

function subscribeScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/studios", label: "Explore Studios" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#about", label: "About Us" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const pathname = usePathname();
  const { setTheme, resolvedTheme } = useTheme();
  const { user, logout } = useAuth();
  const mounted = useMounted();
  const [open, setOpen] = React.useState(false);

  // Scroll state read through the external store — no setState-in-effect
  const scrolled = React.useSyncExternalStore(
    subscribeScroll,
    () => window.scrollY > 12,
    () => false,
  );

  // Close the mobile sheet when the route changes (adjust-state-during-render)
  const [prevPathname, setPrevPathname] = React.useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  function initials(name: string) {
    return name
      .split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }

  async function handleLogout() {
    await logout();
    toast.success("Signed out — see you on the next shoot.");
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-border bg-background/85 shadow-[0_8px_30px_-20px_oklch(0_0_0/0.5)] backdrop-blur-lg"
          : "border-b border-transparent bg-background/40 backdrop-blur-sm",
      )}
    >
      <div className="section-pad flex h-16 items-center justify-between gap-4">
        <Link href="/" aria-label="StudioSpace home">
          <Logo />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {NAV_LINKS.map((link) => {
            const active = !link.href.includes("#") && isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {link.label}
                {active ? (
                  <span
                    aria-hidden
                    className="absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded-full bg-primary"
                  />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
            className="rounded-full"
          >
            {mounted && resolvedTheme === "dark" ? (
              <SunIcon className="size-4" />
            ) : (
              <MoonIcon className="size-4" />
            )}
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    className="gap-2 rounded-full pr-1.5 pl-1.5"
                  />
                }
              >
                <Avatar className="size-8 ring-2 ring-primary/40">
                  <AvatarImage src={user.photoURL} alt={user.name} />
                  <AvatarFallback className="bg-primary/15 text-xs font-bold text-primary">
                    {initials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden max-w-[9rem] truncate text-sm font-medium md:inline">
                  {user.name}
                </span>
                <ChevronDownIcon
                  aria-hidden
                  className="size-3.5 text-muted-foreground"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60">
                <DropdownMenuLabel className="truncate text-xs text-muted-foreground">
                  {user.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem nativeButton={false} render={<Link href="/dashboard" />}>
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem nativeButton={false} render={<Link href="/add-studio" />}>
                  Add New Studio
                </DropdownMenuItem>
                <DropdownMenuItem nativeButton={false} render={<Link href="/my-listings" />}>
                  My Studio Listings
                </DropdownMenuItem>
                <DropdownMenuItem nativeButton={false} render={<Link href="/my-bookings" />}>
                  My Bookings
                </DropdownMenuItem>
                <DropdownMenuItem nativeButton={false} render={<Link href="/saved-studios" />}>
                  Saved Studios
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={handleLogout}
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden items-center gap-2 lg:flex">
              <Button
                nativeButton={false} render={<Link href="/login" />}
                variant="ghost"
                className="rounded-full font-semibold"
              >
                Login
              </Button>
              <Button
                nativeButton={false} render={<Link href="/register" />}
                className="beam rounded-full font-semibold shadow-[0_10px_25px_-12px_oklch(0.76_0.155_62)]"
              >
                Register
              </Button>
            </div>
          )}

          {/* Mobile sheet */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Open menu"
                  className="rounded-full lg:hidden"
                />
              }
            >
              <MenuIcon className="size-5" />
            </SheetTrigger>
            <SheetContent side="right" className="flex w-80 flex-col gap-6">
              <SheetHeader>
                <SheetTitle>
                  <Logo />
                </SheetTitle>
              </SheetHeader>

              <nav className="flex flex-col gap-1" aria-label="Mobile">
                {NAV_LINKS.map((link) => {
                  const active =
                    !link.href.includes("#") && isActive(pathname, link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "rounded-lg px-3 py-2.5 text-base font-medium transition-colors",
                        active
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-auto flex flex-col gap-2 border-t border-border pt-4">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 rounded-lg bg-muted/60 p-3">
                      <Avatar className="size-9">
                        <AvatarImage src={user.photoURL} alt={user.name} />
                        <AvatarFallback className="bg-primary/15 text-xs font-bold text-primary">
                          {initials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">
                          {user.name}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <Button
                      nativeButton={false} render={<Link href="/dashboard" />}
                      variant="outline"
                      className="rounded-full"
                    >
                      Dashboard
                    </Button>
                    <Button
                      nativeButton={false} render={<Link href="/add-studio" />}
                      variant="outline"
                      className="rounded-full"
                    >
                      Add New Studio
                    </Button>
                    <Button
                      nativeButton={false} render={<Link href="/my-listings" />}
                      variant="outline"
                      className="rounded-full"
                    >
                      My Studio Listings
                    </Button>
                    <Button
                      nativeButton={false} render={<Link href="/my-bookings" />}
                      variant="outline"
                      className="rounded-full"
                    >
                      My Bookings
                    </Button>
                    <Button
                      nativeButton={false} render={<Link href="/saved-studios" />}
                      variant="outline"
                      className="rounded-full"
                    >
                      Saved Studios
                    </Button>
                    <Button
                      variant="destructive"
                      className="rounded-full"
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      nativeButton={false} render={<Link href="/login" />}
                      variant="outline"
                      className="rounded-full"
                    >
                      Login
                    </Button>
                    <Button
                      nativeButton={false} render={<Link href="/register" />}
                      className="rounded-full"
                    >
                      Register
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
