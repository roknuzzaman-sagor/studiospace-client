"use client";

import * as React from "react";
import axios from "axios";
import { toast } from "sonner";
import { api } from "./api";
import {
  createGooglePayload,
  createLoginPayload,
  createRegisterPayload,
  isUnauthorizedStatus,
} from "./auth-contract";
import { getErrorMessage } from "./errors";
import type { AuthUser } from "./types";

interface ApiUser {
  id: string;
  name: string;
  email: string;
  photoURL: string;
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
    _id: raw.id,
    name: raw.name,
    email: raw.email,
    photoURL: raw.photoURL,
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
  const sessionRequestRef = React.useRef<Promise<ApiUser> | null>(null);

  React.useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        sessionRequestRef.current ??= api
          .get<{ user: ApiUser }>("/auth/me")
          .then(({ data }) => data.user);
        const sessionUser = await sessionRequestRef.current;
        if (!cancelled) setUser(mapUser(sessionUser));
      } catch (error) {
        if (!cancelled) {
          setUser(null);
          if (
            !isUnauthorizedStatus(
              axios.isAxiosError(error) ? error.response?.status : undefined,
            )
          ) {
            toast.error(getErrorMessage(error, "Unable to restore your session."));
          }
        }
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
    } catch (error) {
      if (
        isUnauthorizedStatus(
          axios.isAxiosError(error) ? error.response?.status : undefined,
        )
      ) {
        setUser(null);
        return null;
      }
      throw error;
    }
  }, []);

  const login = React.useCallback(async (email: string, password: string) => {
    const { data } = await api.post<{ user: ApiUser }>("/auth/login", {
      ...createLoginPayload(email, password),
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

      await api.post("/auth/register", createRegisterPayload(input));
    },
    [],
  );

  const googleLogin = React.useCallback(async (credential: string) => {
    const { data } = await api.post<{ user: ApiUser }>("/auth/google", {
      ...createGooglePayload(credential),
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
