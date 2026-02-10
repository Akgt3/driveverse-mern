import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import { useTheme } from "./context/ThemeContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ScrollToTop from "./components/ScrollToTop";

/* 🔔 THEME-AWARE TOAST */
function ToastWrapper() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 3000,
        style: {
          padding: "14px 20px",
          borderRadius: "12px",
          fontSize: "14px",
          fontWeight: 500,
          background: isDark ? "#0f0f0f" : "#ffffff",
          color: isDark ? "#f5f5f5" : "#111111",
          boxShadow: isDark
            ? "0 10px 30px rgba(0,0,0,0.6)"
            : "0 10px 30px rgba(0,0,0,0.12)",
        },
      }}
    />
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <React.StrictMode>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <ScrollToTop />
            <App />
            <ToastWrapper />
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </React.StrictMode>
  </GoogleOAuthProvider>
);
