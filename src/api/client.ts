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
    const status = error?.response?.status;

    // Si la request era /auth/refresh -> no reintentar refresh (ya falló)
    if (originalRequest?.url?.includes("/auth/refresh")) {
      userAuthStore.getState().logout();
      return Promise.reject(error);
    }

    if ((status === 401 || status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await refreshClient.post("/auth/refresh", {}, { withCredentials: true });
        userAuthStore.getState().setAccessToken(data.access_token);
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${data.access_token}`,
        };
        return api(originalRequest);
      } catch (e) {
        userAuthStore.getState().logout();
        return Promise.reject(e);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
