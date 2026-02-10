import { FiGrid, FiTruck, FiUsers, FiLogOut } from "react-icons/fi";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminSidebar({ open, setOpen }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const links = [
    { label: "Dashboard", path: "/admin", icon: <FiGrid /> },
    { label: "Listings", path: "/admin/listings", icon: <FiTruck /> },
    { label: "Users", path: "/admin/users", icon: <FiUsers /> },
  ];

  return (
    <>
      {/* OVERLAY (MOBILE) */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50
          w-[260px] min-h-screen
          bg-white dark:bg-[#0F0F0F]
          border-r border-gray-200 dark:border-[#333333]
          transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* HEADER SPACE */}
        <div className="h-[72px]" />

        {/* NAV LINKS */}
        <nav className="px-4 py-6 space-y-1">
          {links.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              end
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `
                  flex items-center gap-3 px-4 py-3 rounded-lg
                  text-sm font-medium
                  ${isActive
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1A1A1A]"
                }
                `
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* LOGOUT */}
        <div className="absolute bottom-6 w-full px-4">
          <button
            onClick={() => {
              logout();
              navigate("/admin/login", { replace: true });
            }}
            className="
              w-full flex items-center gap-3 px-4 py-3
              text-sm font-medium text-red-500 rounded-lg
              hover:bg-red-50 dark:hover:bg-[#1A1A1A]
            "
          >
            <FiLogOut />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
