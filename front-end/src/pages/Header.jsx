import {
  FiHeart,
  FiMessageCircle,
  FiUser,
  FiSun,
  FiMoon,
  FiMenu,
} from "react-icons/fi";
import { useEffect, useState, useCallback } from "react";
import { useTheme } from "../context/ThemeContext";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProfileMenu from "../components/ProfileMenu";
import socket from "../socket/socket";

export default function Header() {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ BLOCK HEADER FOR ADMIN
  useEffect(() => {
    if (user?.role === "admin" && !location.pathname.startsWith("/admin")) {
      navigate("/admin", { replace: true });
    }
  }, [user, location, navigate]);

  const navLinks = [
    { label: "Buy", path: "/buy" },
    { label: "Sell", path: "/sell" },
    { label: "Careers", path: "/careers" },
    { label: "News", path: "/news" },
    { label: "User Reviews", path: "/reviews" },
    { label: "About Us", path: "/about" },
  ];

  const [unreadCount, setUnreadCount] = useState(0);

  /* ================= FETCH HEADER COUNT ================= */
  const fetchUnreadCount = useCallback(async () => {
    if (!user) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/chats/unread-count`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await res.json();
      setUnreadCount(data.count);
    } catch (err) {
      console.error("Header unread fetch failed");
    }
  }, [user]);

  /* ================= INITIAL LOAD ================= */
  useEffect(() => {
    if (!user?._id) return;
    fetchUnreadCount();
  }, [user, fetchUnreadCount]);

  /* ================= SOCKET LISTENER (ONLY FOR RECEIVED MESSAGES) ================= */
  useEffect(() => {
    if (!user?._id) return;

    socket.emit("registerUser", user._id);

    // ✅ ONLY updates when someone ELSE sends you a message
    const handleNotification = () => {
      console.log("📬 Header notification received");
      fetchUnreadCount();
    };

    socket.on("newNotification", handleNotification);

    return () => socket.off("newNotification", handleNotification);
  }, [user, fetchUnreadCount]);

  /* ================= CLEAR WHEN OPEN CHAT ================= */
  useEffect(() => {
    const clear = () => fetchUnreadCount();
    window.addEventListener("clearHeaderNotification", clear);
    return () =>
      window.removeEventListener("clearHeaderNotification", clear);
  }, [fetchUnreadCount]);

  return (
    <header className="fixed top-0 left-0 z-50 w-full bg-white dark:bg-[#0A0A0A] border-b border-gray-200 dark:border-[#333333] transition-colors">
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="h-[72px] flex items-center justify-between">
          {/* LEFT */}
          <div className="flex items-center gap-14">
            {/* Logo */}
            <Link to="/" className="leading-none">
              <p className="text-[18px] font-semibold tracking-wide text-black dark:text-white">
                Drive
              </p>
              <p className="text-[18px] font-semibold tracking-wide -mt-1 text-black dark:text-white">
                VERSE
              </p>
            </Link>

            {/* Navigation (DESKTOP) */}
            <nav className="hidden min-[1016px]:flex items-center gap-10 text-[15px]">
              {navLinks.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.path}
                  className={({ isActive }) =>
                    `transition ${isActive
                      ? "text-black dark:text-white font-medium border-b-2 border-black dark:border-white pb-1"
                      : "text-gray-800 dark:text-gray-300 hover:text-black dark:hover:text-white"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4 text-black dark:text-white transition-colors">
            {/* Wishlist */}
            <button
              onClick={() => {
                if (!user) {
                  navigate("/auth", { replace: true });
                } else {
                  navigate("/wishlist");
                }
              }}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              <FiHeart size={20} />
            </button>

            {/* Chat */}
            <button
              onClick={() => {
                if (!user) {
                  navigate("/auth");
                } else {
                  navigate("/chat");
                }
              }}
              className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <FiMessageCircle size={20} />

              {user && unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 min-w-[16px] px-1 text-[10px] bg-red-500 text-white rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Theme Toggle (DESKTOP) */}
            <div className="hidden min-[1016px]:flex items-center gap-3">
              <FiSun
                size={18}
                className={`transition-opacity duration-200 ${theme === "dark" ? "opacity-30 text-gray-400" : "opacity-100 text-black"
                  }`}
              />

              <div
                onClick={toggleTheme}
                className="relative w-10 h-5 rounded-full cursor-pointer bg-gray-300 dark:bg-neutral-700 transition-colors duration-300"
              >
                <div
                  className={`absolute top-[2px] w-4 h-4 rounded-full bg-white dark:bg-black shadow transition-transform duration-300 ease-in-out ${theme === "dark" ? "translate-x-5" : "translate-x-1"
                    }`}
                />
              </div>

              <FiMoon
                size={18}
                className={`transition-opacity duration-200 ${theme === "dark" ? "opacity-100 text-white" : "opacity-30 text-gray-400"
                  }`}
              />
            </div>

            {/* User (DESKTOP) */}
            {!user ? (
              <Link
                to="/auth"
                className="hidden min-[1016px]:flex items-center gap-2 text-black dark:text-white"
              >
                <FiUser size={18} />
                <span className="text-[15px] font-medium">Sign In / Up</span>
              </Link>
            ) : (
              <ProfileMenu user={user} />
            )}

            {/* Hamburger (MOBILE) */}
            <button
              onClick={() => setOpen(!open)}
              className="min-[1016px]:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              <FiMenu size={22} />
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="min-[1016px]:hidden bg-white dark:bg-[#0A0A0A] border-t border-gray-200 dark:border-[#333333] transition-colors">
          <nav className="flex flex-col px-6 py-4 gap-4 text-[15px] text-black dark:text-white">
            {navLinks.map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `relative py-2 pl-3 transition border-b border-gray-100 dark:border-[#333333] ${isActive
                    ? "text-black dark:text-white font-medium"
                    : "text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}

            {/* AUTH (MOBILE ONLY) */}
            {!user && (
              <Link
                to="/auth"
                onClick={() => setOpen(false)}
                className="mt-2 h-[44px] flex items-center justify-center gap-2 rounded-lg bg-black text-white dark:bg-white dark:text-black font-medium transition"
              >
                <FiUser size={18} />
                Sign In / Up
              </Link>
            )}

            {/* Theme Toggle (MOBILE) */}
            <div className="flex items-center justify-between pt-3">
              <span className="text-sm font-medium">Appearance</span>

              <div className="flex items-center gap-3">
                <FiSun
                  size={16}
                  className={`transition-opacity duration-200 ${theme === "dark" ? "opacity-30 text-gray-400" : "opacity-100 text-black"
                    }`}
                />

                <div
                  onClick={toggleTheme}
                  className="relative w-10 h-5 rounded-full cursor-pointer bg-gray-300 dark:bg-neutral-700 transition-colors duration-300"
                >
                  <div
                    className={`absolute top-[2px] w-4 h-4 rounded-full bg-white dark:bg-black shadow transition-transform duration-300 ease-in-out ${theme === "dark" ? "translate-x-5" : "translate-x-1"
                      }`}
                  />
                </div>

                <FiMoon
                  size={16}
                  className={`transition-opacity duration-200 ${theme === "dark" ? "opacity-100 text-white" : "opacity-30 text-gray-400"
                    }`}
                />
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}