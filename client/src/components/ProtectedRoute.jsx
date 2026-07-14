import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, role }) {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" />;
    }

    // Fixed strict role evaluation to handle case variation mismatch across context pipelines
    if (role && user.role.toLowerCase() !== role.toLowerCase()) {
        return <Navigate to="/" />;
    }

    return children;
}

export default ProtectedRoute;