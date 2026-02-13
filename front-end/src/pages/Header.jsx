import {
  FiHeart,
  FiMessageCircle,
  FiUser,
  FiSun,
  FiMoon,
  FiMenu,
} from "react-icons/fi";
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useTheme } from "../context/ThemeContext";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProfileMenu from "../components/ProfileMenu";

const socket = io(import.meta.env.VITE_SOCKET_URL, {
  transports: ["websocket"],
  autoConnect: false,
});

export default function Header() {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Prevent duplicate fetches
  const isFetchingRef = useRef(false);
  const lastFetchTimeRef = useRef(0);

  useEffect(() => {
    if (user?.role === "admin" && !location.pathname.startsWith("/admin")) {
      console.log("🚫 Admin trying to access user area - redirecting");
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

  /* ================= FETCH HEADER COUNT WITH DEDUPLICATION ================= */
  const fetchUnreadCount = async () => {
    if (!user) return;

    // ✅ Prevent multiple simultaneous fetches
    if (isFetchingRef.current) {
      console.log("⏳ [HEADER] Already fetching, skipping...");
      return;
    }

    // ✅ Debounce: Don't fetch more than once per 500ms
    const now = Date.now();
    if (now - lastFetchTimeRef.current < 500) {
      console.log("⏳ [HEADER] Too soon, debouncing...");
      return;
    }

    isFetchingRef.current = true;
    lastFetchTimeRef.current = now;

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
      const count = data.count || 0;

      setUnreadCount(count);
      console.log("📊 [HEADER] Unread count updated:", count);
    } catch (err) {
      console.error("Header unread fetch failed");
    } finally {
      isFetchingRef.current = false;
    }
  };

  /* ================= INITIAL LOAD ================= */
  useEffect(() => {
    if (!user?._id) return;

    fetchUnreadCount();

    if (!socket.connected) {
      socket.connect();
    }
    socket.emit("registerUser", user._id);
  }, [user]);

  /* ================= SOCKET LISTENER - DEBOUNCED ================= */
  useEffect(() => {
    if (!user?._id) return;

    // ✅ Debounced refresh
    let refreshTimeout;
    const debouncedRefresh = () => {
      clearTimeout(refreshTimeout);
      refreshTimeout = setTimeout(() => {
        fetchUnreadCount();
      }, 300);
    };

    const onNewNotification = (data) => {
      console.log("🔔 [HEADER] New notification:", data);
      debouncedRefresh();
    };

    const onChatUpdated = (data) => {
      console.log("💬 [HEADER] Chat updated:", data);
      debouncedRefresh();
    };

    const onReceiveMessage = (msg) => {
      console.log("📩 [HEADER] Message received:", msg);
      if (msg.sender !== user._id) {
        debouncedRefresh();
      }
    };

    socket.on("newNotification", onNewNotification);
    socket.on("chatUpdated", onChatUpdated);
    socket.on("receiveMessage", onReceiveMessage);

    return () => {
      clearTimeout(refreshTimeout);
      socket.off("newNotification", onNewNotification);
      socket.off("chatUpdated", onChatUpdated);
      socket.off("receiveMessage", onReceiveMessage);
    };
  }, [user]);

  /* ================= REFRESH ON VISIBILITY CHANGE ================= */
  useEffect(() => {
    if (!user) return;

    // ✅ Refresh count when user returns to tab
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log("👁️ [HEADER] Tab visible, refreshing count...");
        fetchUnreadCount();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user]);

  /* ================= REFRESH ON ROUTE CHANGE ================= */
  useEffect(() => {
    // ✅ Refresh when navigating away from chat
    if (!location.pathname.startsWith('/chat') && user) {
      console.log("🔄 [HEADER] Route changed, refreshing count...");
      fetchUnreadCount();
    }
  }, [location.pathname, user]);

  /* ================= CLEAR WHEN OPEN CHAT ================= */
  useEffect(() => {
    const clear = () => {
      console.log("🔄 [HEADER] Clearing notification (chat opened)");
      fetchUnreadCount();
    };

    window.addEventListener("clearHeaderNotification", clear);
    return () =>
      window.removeEventListener("clearHeaderNotification", clear);
  }, []);

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

            {/* CHAT - PERSISTENT NOTIFICATION */}
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

              {/* ✅ NOTIFICATION BADGE - PERSISTS UNTIL MESSAGES READ */}
              {user && unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 min-w-[16px] px-1 text-[10px] bg-red-500 text-white rounded-full flex items-center justify-center font-medium">
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