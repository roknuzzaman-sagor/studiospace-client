"use client";

import * as React from "react";
import { createAuthClient } from "better-auth/react";
import type { AuthUser } from "./types";
import { hasBackend } from "./api";

const authClient = hasBackend
  ? createAuthClient({ baseURL: process.env.NEXT_PUBLIC_API_URL })
  : null;

const STORAGE_KEY = "studiospace.session";
const USERS_KEY = "studiospace.users";

interface StoredUser extends AuthUser {
  password: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  mode: "demo" | "live";
  login: (email: string, password: string) => Promise<void>;
  register: (input: {
    name: string;
    email: string;
    photoURL: string;
    password: string;
  }) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

function readUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function readSession(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

function writeSession(user: AuthUser | null) {
  if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  else localStorage.removeItem(STORAGE_KEY);
}

export function validatePassword(password: string): string | null {
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter.";
  }
  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter.";
  }
  if (password.length < 6) {
    return "Password must be at least 6 characters long.";
  }
  return null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;

    async function restore() {
      if (authClient) {
        try {
          const { data } = await authClient.getSession();
          if (!cancelled) setUser((data?.user as AuthUser | undefined) ?? null);
        } catch {
          if (!cancelled) setUser(null);
        }
      } else {
        if (!cancelled) setUser(readSession());
      }
      if (!cancelled) setLoading(false);
    }

    void restore();
    return () => {
      cancelled = true;
    };
  }, []);

  const value = React.useMemo<AuthContextValue>(() => {
    async function login(email: string, password: string) {
      if (authClient) {
        const { error } = await authClient.signIn.email({ email, password });
        if (error) throw new Error(error.message ?? "Unable to sign in.");
        const { data } = await authClient.getSession();
        setUser((data?.user as AuthUser | undefined) ?? null);
        return;
      }

      // Demo mode — validates against locally registered accounts
      const stored = readUsers().find(
        (u) => u.email.toLowerCase() === email.toLowerCase(),
      );
      if (!stored || stored.password !== password) {
        throw new Error("Incorrect email or password. Please try again.");
      }
      const session: AuthUser = {
        name: stored.name,
        email: stored.email,
        photoURL: stored.photoURL,
      };
      writeSession(session);
      setUser(session);
    }

    async function register(input: {
      name: string;
      email: string;
      photoURL: string;
      password: string;
    }) {
      const invalid = validatePassword(input.password);
      if (invalid) throw new Error(invalid);

      if (authClient) {
        const { error } = await authClient.signUp.email({
          name: input.name,
          email: input.email,
          password: input.password,
          image: input.photoURL,
        });
        if (error) throw new Error(error.message ?? "Unable to register.");
        return;
      }

      const users = readUsers();
      if (
        users.some((u) => u.email.toLowerCase() === input.email.toLowerCase())
      ) {
        throw new Error("An account with this email already exists.");
      }
      users.push({ ...input, password: input.password });
      writeUsers(users);
    }

    async function loginWithGoogle() {
      if (authClient) {
        await authClient.signIn.social({
          provider: "google",
          callbackURL: "/",
        });
        return;
      }
      // Demo mode — simulated Google session
      const session: AuthUser = {
        name: "Examiner Google",
        email: "examiner@studiospace.dev",
        photoURL:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
      };
      writeSession(session);
      setUser(session);
    }

    async function logout() {
      if (authClient) {
        await authClient.signOut();
        setUser(null);
        return;
      }
      writeSession(null);
      setUser(null);
    }

    return {
      user,
      loading,
      mode: authClient ? "live" : "demo",
      login,
      register,
      loginWithGoogle,
      logout,
    };
  }, [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>.");
  return ctx;
}
