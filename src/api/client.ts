import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? "https://apiauth-lorv.onrender.com",
    withCredentials: true,
});

export interface AuthResponse {
    access_token: string;
    refresh_token?: string;
    token_type: "bearer";
}