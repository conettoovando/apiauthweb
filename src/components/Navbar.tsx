import { useState } from "react";
import Modal from "./Modal";
import { userAuthStore } from "../hooks/useAuthStore";
import { useNavigate } from "react-router-dom";
import api from "../api/client";

export default function Navbar() {
  const navigate = useNavigate();
  const user = userAuthStore((state) => state.user?.role)

  const [openModal, setOpenModal] = useState(false);

  const logoutStore = userAuthStore((state) => state.logout);

  const logout = async () => {
    try {
      await api.post("/auth/logout", {});
    } catch (err) {
      console.log("Error al cerrar sesión:", err);
    } finally {
      logoutStore();
      navigate("/");
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            API De Autenticación
          </span>
        </div>
        <div className="flex md:order-2 space-x-3 md:space-x-4 rtl:space-x-reverse">
          <button
            onClick={() => setOpenModal(true)}
            type="button"
            className="disabled:hidden text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            disabled={user==="superuser"}
          >
            Cuenta admin
          </button>
          <button
            onClick={logout}
            type="button"
            className="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
          >
            Cerrar sesion
          </button>
          <Modal open={openModal} setOpen={setOpenModal} />
        </div>
      </div>
    </nav>
  );
}
