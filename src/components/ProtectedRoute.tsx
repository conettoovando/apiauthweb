import { Navigate } from "react-router-dom";
import { userAuthStore } from "../hooks/useAuthStore";

type Props = {
    children: React.ReactNode
}

const ProtectedRoute = ({ children }: Props) => {
    const user = userAuthStore((state) => state.user);

    if (!user) {
        return <Navigate to={"/"} replace />
    }

    if (Date.now() >= user.exp * 1000) {
        userAuthStore.getState().logout();
        return <Navigate to={"/"} replace />
    }

    return <>{children}</>
}

export default ProtectedRoute