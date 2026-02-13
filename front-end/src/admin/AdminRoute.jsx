import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

export default function AdminRoute({ children }) {
  const { user, logout } = useAuth();

  // ✅ FORCE LOGOUT IF NON-ADMIN TRIES TO ACCESS
  useEffect(() => {
    if (user && user.role !== "admin") {
      console.log("🚫 Non-admin trying to access admin area - logging out");
      logout();
    }
  }, [user, logout]);

  // ❌ NOT LOGGED IN → ADMIN LOGIN
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  // ❌ LOGGED IN BUT NOT ADMIN → FORCE LOGOUT + REDIRECT
  if (user.role !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }

  // ✅ ADMIN AUTHENTICATED
  return children;
}