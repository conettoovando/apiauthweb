// ProtectedRoute.tsx
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { userAuthStore } from "../hooks/useAuthStore";
import { refreshClient } from "../api/client"; // IMPORTANTE: cliente "limpio" (sin interceptores)

type Props = { children: React.ReactNode };

export default function ProtectedRoute({ children }: Props) {
  const user = userAuthStore((s) => s.user);
  const setAccessToken = userAuthStore((s) => s.setAccessToken);
  const logout = userAuthStore((s) => s.logout);

  const [loading, setLoading] = useState(true);
  const [triedRefresh, setTriedRefresh] = useState(false);

  useEffect(() => {
    let mounted = true;

    const attemptRefresh = async () => {
      // Si ya tenemos user → nada que hacer
      if (user) {
        if (mounted) setLoading(false);
        return;
      }

      // Si ya intentamos refresh → dejamos de intentar
      if (triedRefresh) {
        if (mounted) setLoading(false);
        return;
      }

      setTriedRefresh(true);

      try {
        console.log("[ProtectedRoute] intentando /auth/refresh...");
        // Usa el cliente 'limpio' para evitar loops en interceptores
        const { data } = await refreshClient.post("/auth/refresh", {}, { withCredentials: true });
        if (data?.access_token) {
          console.log("[ProtectedRoute] refresh ok, nuevo access_token recibido");
          setAccessToken(data.access_token);
          if (mounted) setLoading(false);
          return;
        }
        // si no vino token, tratar como logout
        throw new Error("No access_token en respuesta de refresh");
      } catch (err) {
        console.error("[ProtectedRoute] refresh falló:", err);
        logout();
        if (mounted) setLoading(false);
      }
    };

    attemptRefresh();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // se ejecuta al montar

  if (loading) return <div>Cargando...</div>;
  if (!user) return <Navigate to="/" replace />;

  return <>{children}</>;
}
