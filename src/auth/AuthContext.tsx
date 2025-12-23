import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";
import type { AuthUser } from "../lib/types";
import { ApiError } from "../lib/http";

type AuthState = {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;

  refresh: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, username: string, password: string, repeatPassword: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

type MeLike = { user_id?: number; username: string; city: string };

function toUser(prev: AuthUser | null, resp: MeLike): AuthUser {
  return {
    userId: resp.user_id ?? prev?.userId,
    username: resp.username,
    city: resp.city,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setError(null);
    try {
      const me = await api.me();
      setUser((prev) => toUser(prev, me));
    } catch (e) {
      if (e instanceof ApiError && (e.status === 401 || e.status === 403)) {
        setUser(null);
        return;
      }
      setError(e instanceof Error ? e.message : "Ошибка запроса");
      throw e;
    }
  }, []);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        await refresh();
      } catch {
      } finally {
        setIsLoading(false);
      }
    })();
  }, [refresh]);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    const resp = await api.login({ email, password });
    setUser((prev) => toUser(prev, resp));
  }, []);

  const signup = useCallback(async (email: string, username: string, password: string, repeatPassword: string) => {
    setError(null);
    const resp = await api.signup({ email, username, password, repeat_password: repeatPassword });
    setUser((prev) => toUser(prev, resp));
  }, []);

  const logout = useCallback(async () => {
    setError(null);
    try {
      await api.logout();
    } finally {
      setUser(null);
    }
  }, []);

  const value = useMemo<AuthState>(() => ({
    user,
    isLoading,
    error,
    refresh,
    login,
    signup,
    logout,
  }), [user, isLoading, error, refresh, login, signup, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
