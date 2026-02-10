import { useState } from "react";
import {
  FiLogOut,
  FiHelpCircle,
  FiSettings,
  FiList,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";


export default function ProfileMenu({ user, mode = "desktop", onOpen }) {
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  /* =======================
     TRIGGER
  ======================= */
  const trigger =
    mode === "mobile" ? (
      /* MOBILE PROFILE CARD */
      <div
        onClick={() => {
          onOpen?.();
          setOpen(true);
        }}
        className="
          flex items-center gap-3
          p-3 rounded-xl
          bg-gray-100 dark:bg-[#141414]
          border border-gray-200 dark:border-[#333333]
          cursor-pointer
        "
      >
        <img
          src={user.avatar}
          className="w-10 h-10 rounded-full object-cover"
          alt="profile"
        />
        <div className="flex-1">
          <p className="text-sm font-medium text-black dark:text-white">
            {user.name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {user.email}
          </p>
        </div>
      </div>
    ) : (
      /* DESKTOP AVATAR */
      <img
        src={user.avatar}
        onClick={() => setOpen(!open)}
        className="
          w-9 h-9 rounded-full cursor-pointer
          object-cover
          border border-gray-300 dark:border-gray-600
        "
        alt="profile"
      />
    );

  return (
    <div className={mode === "desktop" ? "relative" : ""}>
      {trigger}

      {open && (
        <>
          {/* OVERLAY */}
          <div
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 bg-black/30"
          />

          {/* =======================
             POPUP (CENTERED FIX)
          ======================= */}
          {mode === "mobile" ? (
            <div className="fixed inset-0 z-50 flex items-end pointer-events-none px-4">
              <div
                className="
        pointer-events-auto
        mx-auto
        mb-4
        w-full
        max-w-[280px]
        rounded-xl shadow-xl overflow-hidden
        bg-white dark:bg-[#1f1f1f]
        text-black dark:text-white
      "
              >
                <PopupContent
                  user={user}
                  logout={logout}
                  close={() => setOpen(false)}
                />
              </div>
            </div>
          ) : (
            <div
              className="
                absolute right-0 top-full mt-3 z-50
                w-[280px]
                rounded-xl shadow-xl overflow-hidden
                bg-white dark:bg-[#1f1f1f]
                text-black dark:text-white
              "
            >
              <PopupContent
                user={user}
                logout={logout}
                close={() => setOpen(false)}
                navigate={navigate}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* =======================
   POPUP CONTENT
======================= */
function PopupContent({ user, logout, close, navigate }) {
  return (
    <>
      {/* USER INFO */}
      <div className="px-4 py-4 border-b border-gray-200 dark:border-neutral-700">
        <div className="flex items-center gap-3">
          <img
            src={user.avatar}
            className="w-12 h-12 rounded-full"
            alt="profile"
          />
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {user.email}
            </p>
          </div>
        </div>
      </div>

      {/* MENU */}
      <div className="py-2 text-sm">
        <MenuItem icon={<FiList />} to="/my-ads" onClick={close}>
          My Ads
        </MenuItem>
        {user.authProvider === "local" && (
          <MenuItem icon={<FiSettings />} to="/settings" onClick={close}>
            Settings
          </MenuItem>
        )}
        <MenuItem icon={<FiHelpCircle />} to="/help" onClick={close}>
          Help
        </MenuItem>

        <div className="border-t border-gray-200 dark:border-neutral-700 my-1" />

        <button
          onClick={() => {
            logout();
            toast.success("Signed out successfully");
            close();
            navigate("/auth");
          }}
          className="
    w-full px-4 py-2
    flex items-center gap-3
    text-red-500
    hover:bg-red-50 dark:hover:bg-neutral-800
  "
        >
          <FiLogOut />
          Logout
        </button>
      </div>
    </>
  );
}

/* =======================
   MENU ITEM
======================= */
function MenuItem({ icon, children, to, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="
        w-full px-4 py-2
        flex items-center gap-3
        rounded-md
        text-gray-700 dark:text-gray-200
        hover:bg-gray-100 dark:hover:bg-neutral-800
        hover:text-black dark:hover:text-white
      "
    >
      <span className="text-gray-400 dark:text-gray-500">{icon}</span>
      {children}
    </Link>
  );
}
