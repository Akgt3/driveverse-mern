import { FiSun, FiMoon, FiShield, FiMenu } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

export default function AdminHeader({ onMenuClick }) {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <header
      className="
        fixed top-0 left-0 z-50 w-full
        bg-white dark:bg-[#0F0F0F]
        border-b border-gray-200 dark:border-[#333333]
        transition-colors
      "
    >
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="h-[72px] flex items-center justify-between">

          {/* LEFT */}
          <div className="flex items-center gap-4">

            {/* MOBILE MENU */}
            <button
              onClick={onMenuClick}
              className="
                lg:hidden p-2 rounded-md
                text-black dark:text-white
                hover:bg-gray-100 dark:hover:bg-[#1A1A1A]
              "
            >
              <FiMenu size={22} />
            </button>

            {/* LOGO */}
            <Link to="/admin" className="leading-none">
              <p className="text-[18px] font-semibold text-black dark:text-white">
                Drive
              </p>
              <p className="text-[18px] font-semibold -mt-1 text-black dark:text-white">
                VERSE
              </p>
            </Link>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4">

            {/* ADMIN BADGE */}
            <div
              className="
                hidden sm:flex items-center gap-1
                px-3 py-1 rounded-full
                text-[12px] font-medium
                bg-black text-white
                dark:bg-white dark:text-black
              "
            >
              <FiShield size={14} />
              Admin
            </div>

            {/* THEME TOGGLE */}
            <div className="flex items-center gap-3">

              <FiSun
                size={18}
                className={`transition ${theme === "dark"
                  ? "text-gray-400"
                  : "text-black"
                  }`}
              />

              <div
                onClick={toggleTheme}
                className="
                  relative w-10 h-5 rounded-full cursor-pointer
                  bg-gray-300 dark:bg-neutral-700
                "
              >
                <div
                  className={`
                    absolute top-[2px] w-4 h-4 rounded-full
                    bg-white dark:bg-black
                    transition-transform
                    ${theme === "dark" ? "translate-x-5" : "translate-x-1"}
                  `}
                />
              </div>

              <FiMoon
                size={18}
                className={`transition ${theme === "dark"
                  ? "text-white"
                  : "text-gray-400"
                  }`}
              />
            </div>

            {/* ADMIN AVATAR (STATIC) */}
            {/* ADMIN AVATAR (LETTER) */}
            <div
              className="
    w-9 h-9 rounded-full pb-0.3
    flex items-center justify-center
    bg-black text-white
    dark:bg-white dark:text-black
    font-semibold text-sm
    border border-gray-300 dark:border-gray-600
  "
            >
              {user?.name
                ?.split(" ")
                .map(word => word[0])
                .join("")
                .toUpperCase() || "AD"}
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
