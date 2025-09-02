import Container from "../components/Container";
import Navbar from "../components/Navbar";
import { userAuthStore } from "../hooks/useAuthStore";

export default function Dashboard() {
  const user = userAuthStore((state) => state.user?.role)
  
  return (
    <>
      <Navbar />
      <Container className="h-[calc(100vh-68px)] mt-[68px]">
        <h2>Bienvenido usuario</h2>
        <h2>Su rol es {user}</h2>
        <br />
        <p>Esta pagina se encuentra en desarrollo para la gestion de usuarios y roles <br />Este proyecto ha sido creado principalmente para la demostración del funcionamiento de la api de autenticación</p>
      </Container>
    </>
  );
}
