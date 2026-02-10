import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RequireLocalAuth({ children }) {
  const { user } = useAuth();

  // Not logged in → auth page
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Google users → home
  if (user.authProvider === "google") {
    return <Navigate to="/" replace />;
  }

  return children;
}
