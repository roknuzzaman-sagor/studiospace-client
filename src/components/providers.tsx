"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { AuthProvider } from "@/lib/auth";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>{children}</AuthProvider>
      <Toaster
        position="top-right"
        offset={72}
        richColors
        closeButton
        toastOptions={{
          classNames: {
            toast:
              "rounded-lg border border-border bg-popover text-popover-foreground shadow-lg font-sans",
          },
        }}
      />
    </ThemeProvider>
  );
}
