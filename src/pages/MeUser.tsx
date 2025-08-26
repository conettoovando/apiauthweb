import { useNavigate } from "react-router-dom"
import { api } from "../api/client"

export default function MeUser() {
    const navigate = useNavigate()
    const logout = async () => {
        try {
            api.post("/auth/logout")
            .then(() => navigate("/"))
        }
        catch (err) {
            console.log(err)
        }
        finally{
            localStorage.removeItem("access_token")
        }
    }
    
    return (
        <>
        <h1>
        Ruta protegida
        </h1>
        <button onClick={logout} className="cursor-pointer text-blue-700 hover:text-blue-900">Cerrar sesion</button>
        </>
    )
}