import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import Navbar from "../components/Navbar";
import Container from "../components/Container";
import { userAuthStore } from "../hooks/useAuthStore";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = userAuthStore((state) => state.user?.role)
  const logoutStore = userAuthStore((state) => state.logout);

  const logout = async () => {
    try {
      await api.post("/auth/logout", {});
    } catch (err) {
      console.log("Error al cerrar sesión:",err);
    } finally {
      logoutStore();
      navigate("/")
    }
  };

  return (
    <>
      <Navbar />
      <Container className="h-[calc(100vh-68px)] mt-[68px]">
        <h1>Ruta protegida</h1>
        <h2>Su rol es {user}</h2>
        <button
          onClick={logout}
          className="cursor-pointer text-blue-700 hover:text-blue-900"
        >
          Cerrar sesion
        </button>
      </Container>
    </>
  );
}
