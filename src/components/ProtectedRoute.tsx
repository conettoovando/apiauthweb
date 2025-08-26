import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("access_token")

    if (!token) {
        return <Navigate to={"/"} replace />
    }

    try {
        const { exp } = jwtDecode(token)
        if (Date.now() >= exp * 1000){
            localStorage.removeItem("access_token")
            return <Navigate to={"/"} replace />
        }
    } catch (error) {
        localStorage.removeItem("access_token");
        return <Navigate to={"/"} replace />;
    }

    return children
}

export default ProtectedRoute