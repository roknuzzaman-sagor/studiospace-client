"use client";

import * as React from "react";
import Link from "next/link";
import type { LinkProps as NextLinkProps } from "next/link";
import { Button, type buttonVariants } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";

type ButtonOwnProps = VariantProps<typeof buttonVariants> & {
  className?: string;
  children?: React.ReactNode;
};

/**
 * A Button that renders as a Next.js <Link> — Base UI's `render` prop
 * replaces the classic shadcn `asChild` pattern.
 */
export function LinkButton({
  href,
  ...props
}: ButtonOwnProps & Omit<NextLinkProps, "href"> & { href: NextLinkProps["href"] }) {
  return (
    <Button
      nativeButton={false}
      render={<Link href={href} />}
      variant={props.variant ?? undefined}
      size={props.size ?? undefined}
      className={props.className}
    >
      {props.children}
    </Button>
  );
}
