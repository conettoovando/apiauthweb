// useAuthStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";
import { refreshClient } from "../api/client";

interface TokenPayload {
  sub: number;
  email: string;
  role: string;
  exp: number;
}

interface AuthState {
  user: TokenPayload | null;
  accessToken: string | null;
  setAccessToken: (token: string) => void;
  refreshAccessToken: () => Promise<void>;
  updateUserRol: (role: string) => void;
  logout: () => void;
}

export const userAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,

      setAccessToken: (token) => {
        const decoded = jwtDecode<TokenPayload>(token);
        // 👇 reemplaza TODO el objeto user → dispara rerenders
        set({ accessToken: token, user: { ...decoded } });
      },

      // en useAuthStore
      refreshAccessToken: async () => {
        try {
          const { data } = await refreshClient.post(
            "/auth/refresh",
            {},
            { withCredentials: true }
          );
          const newToken = data.access_token;
          const decoded = jwtDecode<TokenPayload>(newToken);
          set({ accessToken: newToken, user: decoded });
          return newToken;
        } catch (error) {
          console.error("Error refreshing token", error);
          set({ accessToken: null, user: null });
          return null;
        }
      },

      updateUserRol: (role) => {
        set((state) => ({
          user: state.user ? { ...state.user, role } : null,
        }));
      },

      logout: () => set({ accessToken: null, user: null }),
    }),
    { name: "auth-store" }
  )
);
