import { create } from "zustand";
import { jwtDecode } from "jwt-decode";
import { api } from "../api/client";
import { persist } from "zustand/middleware";

interface TokenPayload {
  sub: number;
  role: string;
  exp: number;
}

interface Authstate {
  user: TokenPayload | null;
  accessToken: string | null;
  updateUserRol: (role: string) => void;
  setAccessToken: (token: string) => void;
  refreshAccessToken: () => Promise<void>;
  logout: () => void;
}

export const userAuthStore = create<Authstate>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,

      updateUserRol: (role) => {
        set((state) => ({
          user: state.user ? { ...state.user, role} : null
        }))
      },

      setAccessToken: (token) => {
        const decoded = jwtDecode<TokenPayload>(token);
        set({ accessToken: token, user: decoded });
      },

      refreshAccessToken: async () => {
        try {
          const response = await api.post("/auth/refresh", {});
          const newToken = response.data.access_token;
          const decoded = jwtDecode<TokenPayload>(newToken);
          set({ accessToken: newToken, user: decoded });
        } catch (error) {
          console.error("Error refreshing token", error);
          set({ accessToken: null, user: null });
        }
      },

      logout: () => set({ accessToken: null, user: null }),
    }),
    {
      name: "auth-store",
    }
  )
);
