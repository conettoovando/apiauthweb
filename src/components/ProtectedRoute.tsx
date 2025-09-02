import { Navigate } from "react-router-dom";
import { userAuthStore } from "../hooks/useAuthStore";
import { useEffect, useState } from "react";

type Props = { children: React.ReactNode };

const ProtectedRoute = ({ children }: Props) => {
  const { accessToken, refreshAccessToken } = userAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      if (!accessToken) {
        await refreshAccessToken(); // Intentar refrescar sesión
      }
      setLoading(false);
    };

    checkSession();
  }, [accessToken, refreshAccessToken]);

  if (loading) return <div>Cargando...</div>;
  if (!accessToken) return <Navigate to="/" replace />;

  return <>{children}</>;
};

export default ProtectedRoute