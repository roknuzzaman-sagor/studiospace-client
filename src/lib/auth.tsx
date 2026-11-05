"use client";

import * as React from "react";
import { api } from "./api";
import type { AuthUser } from "./types";

interface ApiUser {
  _id?: string;
  name?: string;
  email: string;
  photoURL?: string;
  image?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (input: {
    name: string;
    email: string;
    photoURL: string;
    password: string;
  }) => Promise<void>;
  googleLogin: (credential: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<AuthUser | null>;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

function mapUser(raw: ApiUser): AuthUser {
  return {
    _id: raw._id,
    name: raw.name ?? "StudioSpace member",
    email: raw.email,
    photoURL: raw.photoURL ?? raw.image ?? "",
  };
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

    (async () => {
      try {
        const { data } = await api.get<{ user: ApiUser }>("/auth/me");
        if (!cancelled) setUser(mapUser(data.user));
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const refreshUser = React.useCallback(async () => {
    try {
      const { data } = await api.get<{ user: ApiUser }>("/auth/me");
      const next = mapUser(data.user);
      setUser(next);
      return next;
    } catch {
      setUser(null);
      return null;
    }
  }, []);

  const login = React.useCallback(async (email: string, password: string) => {
    const { data } = await api.post<{ user: ApiUser }>("/auth/login", {
      email,
      password,
    });
    setUser(mapUser(data.user));
  }, []);

  const register = React.useCallback(
    async (input: {
      name: string;
      email: string;
      photoURL: string;
      password: string;
    }) => {
      const invalid = validatePassword(input.password);
      if (invalid) throw new Error(invalid);

      await api.post("/auth/register", {
        name: input.name,
        email: input.email,
        password: input.password,
        photoURL: input.photoURL,
      });
    },
    [],
  );

  const googleLogin = React.useCallback(async (credential: string) => {
    const { data } = await api.post<{ user: ApiUser }>("/auth/google", {
      credential,
    });
    setUser(mapUser(data.user));
  }, []);

  const logout = React.useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      setUser(null);
    }
  }, []);

  const value = React.useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      login,
      register,
      googleLogin,
      logout,
      refreshUser,
    }),
    [user, loading, login, register, googleLogin, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>.");
  return ctx;
}
