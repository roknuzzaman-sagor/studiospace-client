"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { AuthProvider } from "@/lib/auth";

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        {googleClientId ? (
          <GoogleOAuthProvider clientId={googleClientId}>
            {children}
          </GoogleOAuthProvider>
        ) : (
          children
        )}
      </AuthProvider>
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
