import { useEffect, useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { api } from "../api/client"

export default function Verify(){
    const [status, setStatus] = useState("Verificando...")
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token")
    const user_id = searchParams.get("user_id")

    useEffect(() => {
        if (!token) {
            setStatus("Token no proporcionado")
            return;
        }

        api.post("/users/verify-email", {token, user_id})
        .then(() => {
            setStatus("Cuenta verificada correctamente. Redirigiendo a la ruta protegida")
            setTimeout(() => navigate("/dashboard"), 3000);
        })
        .catch(() => {
            setStatus("Token invalido o expirado")
        })
    },[token, navigate, user_id])

    return (
        <div className="text-center mt-5">
            <h2>{status}</h2>
        </div>
    )
}