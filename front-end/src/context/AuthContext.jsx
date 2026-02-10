import { createContext, useContext, useEffect, useState } from "react";
import socket from "../socket/socket";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const storedUser = localStorage.getItem("user");

  const [user, setUser] = useState(
    storedUser ? JSON.parse(storedUser) : null
  );
  const [wishlist, setWishlist] = useState([]);

  /* ================= SOCKET CONNECT (ONCE) ================= */
  useEffect(() => {
    socket.connect();
    return () => socket.disconnect();
  }, []);

  /* ================= REGISTER USER ROOM ================= */
  useEffect(() => {
    if (!user || user.role === "admin") return;
    socket.emit("registerUser", user._id);
  }, [user]);

  /* ================= 🔥 LIVE ACCOUNT BLOCK (FIXED) ================= */
  useEffect(() => {
    // ✅ This listener persists across the entire app session
    const handleBlock = () => {
      console.log("🚫 Account blocked - logging out immediately");

      // 🔥 HARD LOGOUT
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      setWishlist([]);

      // Force redirect to auth page
      window.location.href = "/auth";
    };

    // ✅ Listen for block event globally
    socket.on("accountBlocked", handleBlock);

    // ✅ Cleanup when component unmounts
    return () => {
      socket.off("accountBlocked", handleBlock);
    };
  }, []); // ✅ Empty dependency array = runs once, persists forever

  /* ================= FETCH WISHLIST ================= */
  useEffect(() => {
    if (!user || user.role === "admin") {
      setWishlist([]);
      return;
    }

    const fetchWishlist = async () => {
      try {
        const res = await fetch(
          "${import.meta.env.VITE_API_URL}/api/users/wishlist",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await res.json();
        setWishlist(Array.isArray(data) ? data.map(i => i._id) : []);
      } catch {
        console.error("Wishlist fetch failed");
      }
    };

    fetchWishlist();
  }, [user]);

  /* ================= AUTH ================= */
  const login = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);

    // ✅ Register socket room immediately after login
    if (userData.role !== "admin") {
      socket.emit("registerUser", userData._id);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setWishlist([]);
  };

  return (
    <AuthContext.Provider value={{ user, wishlist, setWishlist, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
