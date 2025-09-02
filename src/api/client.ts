// client.ts
import axios from "axios";
import { userAuthStore } from "../hooks/useAuthStore";

const baseURL = import.meta.env.VITE_API_URL ?? "https://apiauth-lorv.onrender.com";

export const refreshClient = axios.create({
  baseURL,
  withCredentials: true, // envía cookie
});

// cliente principal con interceptores (usa refreshClient para refrescar)
const api = axios.create({
  baseURL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = userAuthStore.getState().accessToken;
  const isRefresh = config.url?.includes("/auth/refresh");
  if (token && !isRefresh) {
    if (config.headers && typeof config.headers.set === "function") {
      config.headers.set("Authorization", `Bearer ${token}`);
    } else if (config.headers) {
      (config.headers as import("axios").AxiosRequestHeaders)["Authorization"] = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (originalRequest?.url?.includes("/auth/refresh")) {
      userAuthStore.getState().logout();
      return Promise.reject(error);
    }

    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;

      const newToken = await userAuthStore.getState().refreshAccessToken();
      if (newToken!) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } else {
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);


export default api;

export interface AuthResponse {
    access_token: string;
    refresh_token?: string;
    token_type: "bearer";
}