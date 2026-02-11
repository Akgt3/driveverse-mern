import { useState } from "react";
import { FiUserX, FiUserCheck } from "react-icons/fi";
import AdminLayout from "../layout/AdminLayout";
import AdminHeader from "../components/AdminHeader";
import { useEffect } from "react";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  const toggleStatus = async (id) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/admin/status/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // ✅ UPDATE LOCAL STATE WITH BACKEND RESPONSE
      setUsers((prev) =>
        prev.map((u) =>
          u._id === id
            ? {
              ...u,
              status: data.status, // ✅ Use backend status directly
            }
            : u
        )
      );
    } catch (err) {
      alert(err.message || "Failed to update user status");
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/users/admin/all`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await res.json();

        // ✅ USE ACTUAL STATUS FROM DATABASE
        setUsers(
          Array.isArray(data)
            ? data.map(user => ({
              ...user,
              // ✅ Keep backend status, default to "active" if missing
              status: user.status || "active",
            }))
            : []
        );
      } catch (err) {
        console.error("Failed to load users");
      }
    };

    fetchUsers();
  }, []);

  return (
    <AdminLayout>
      <div className="pt-12 px-6 pb-12 max-w-[1400px] mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-black dark:text-white">
            Users
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage registered users
          </p>
        </div>

        {/* ================= DESKTOP TABLE ================= */}
        <div className="hidden md:block bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-[#333333] rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-[#141414] text-left">
              <tr className="text-gray-600 dark:text-gray-400">
                <th className="p-4">Name</th>
                <th>Email</th>
                <th>Status</th>
                <th className="text-right p-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="border-t border-gray-200 dark:border-[#333333]"
                >
                  <td className="p-4 font-medium text-black dark:text-white">
                    {user.name}
                  </td>

                  <td className="text-gray-600 dark:text-gray-400">
                    {user.email}
                  </td>

                  <td>
                    <span
                      className={`px - 3 py - 1 text - xs rounded - full
                        ${user.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                        }
          `}
                    >
                      {/* ✅ CAPITALIZE FOR DISPLAY */}
                      {user.status === "active" ? "Active" : "Blocked"}
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    <button
                      onClick={() => toggleStatus(user._id)}
                      className={`inline - flex items - center gap - 2 px - 3 py - 2 rounded - md text - sm font - medium transition
                        ${user.status === "active"
                          ? "text-red-600 hover:bg-red-50"
                          : "text-green-600 hover:bg-green-50"
                        }
          `}
                    >
                      {user.status === "active" ? (
                        <>
                          <FiUserX />
                          Block
                        </>
                      ) : (
                        <>
                          <FiUserCheck />
                          Unblock
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ================= MOBILE CARDS ================= */}
        <div className="md:hidden space-y-4">
          {users.map((user) => (
            <div
              key={user._id}
              className="bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-[#333333] rounded-xl p-4"
            >
              <p className="font-medium text-black dark:text-white">
                {user.name}
              </p>

              <p className="text-sm text-gray-600 dark:text-gray-400">
                {user.email}
              </p>

              <div className="mt-2">
                <span
                  className={`px - 3 py - 1 text - xs rounded - full
                    ${user.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                    }
          `}
                >
                  {user.status === "active" ? "Active" : "Blocked"}
                </span>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => toggleStatus(user._id)}
                  className={`inline - flex items - center gap - 2 px - 3 py - 2 rounded - md text - sm font - medium
                    ${user.status === "active"
                      ? "text-red-600 hover:bg-red-50"
                      : "text-green-600 hover:bg-green-50"
                    }
          `}
                >
                  {user.status === "active" ? (
                    <>
                      <FiUserX />
                      Block
                    </>
                  ) : (
                    <>
                      <FiUserCheck />
                      Unblock
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
