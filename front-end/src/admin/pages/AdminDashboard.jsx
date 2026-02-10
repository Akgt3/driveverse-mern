import { useState, useEffect } from "react";
import { FiUsers, FiTruck, FiCheckCircle, FiStar } from "react-icons/fi";
import AdminLayout from "../layout/AdminLayout";
import AdminCharts from "../components/AdminCharts";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalListings: 0,
    verifiedListings: 0,
    featuredListings: 0,
  });

  const [recentListings, setRecentListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch user stats
      const userRes = await fetch(
        "http://localhost:5000/api/users/admin/stats",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const userData = await userRes.json();

      // Fetch listing stats
      const listingRes = await fetch(
        "http://localhost:5000/api/listings/admin/stats",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const listingData = await listingRes.json();

      // Fetch all listings for recent display
      const allListingsRes = await fetch("http://localhost:5000/api/listings");
      const allListings = await allListingsRes.json();

      // Get 5 most recent listings
      const recent = Array.isArray(allListings)
        ? allListings.slice(0, 5)
        : [];

      setStats({
        totalUsers: userData.totalUsers || 0,
        totalListings: listingData.totalListings || 0,
        verifiedListings: listingData.verifiedListings || 0,
        featuredListings: listingData.featuredListings || 0,
      });

      setRecentListings(recent);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: <FiUsers />,
    },
    {
      label: "Total Listings",
      value: stats.totalListings,
      icon: <FiTruck />,
    },
    {
      label: "Verified Listings",
      value: stats.verifiedListings,
      icon: <FiCheckCircle />,
    },
    {
      label: "Featured Listings",
      value: stats.featuredListings,
      icon: <FiStar />,
    },
  ];

  return (
    <AdminLayout>
      {/* PAGE HEADER */}
      <div className="mb-10 pt-12">
        <h1 className="text-3xl font-semibold text-black dark:text-white">
          Admin Dashboard
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Platform overview & trust controls
        </p>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading dashboard...</p>
      ) : (
        <>
          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {statCards.map((item, i) => (
              <div
                key={i}
                className="bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-[#333333] rounded-xl p-6 flex gap-4"
              >
                <div
                  className="
                    w-12 h-12 flex items-center justify-center
                    rounded-lg
                    bg-gray-100 dark:bg-[#1A1A1A]
                    text-black dark:text-white
                    text-xl
                  "
                >
                  {item.icon}
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {item.label}
                  </p>
                  <p className="text-xl font-semibold text-black dark:text-white">
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CHARTS */}
          <AdminCharts stats={stats} />

          {/* ================= RECENT LISTINGS ================= */}
          <div className="mt-12 mb-16 bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-[#333333] rounded-xl shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-[#333333]">
              <h2 className="text-lg font-semibold text-black dark:text-white">
                Recent Listings
              </h2>
            </div>

            {/* ===== DESKTOP TABLE ===== */}
            <div className="hidden md:block overflow-x-auto pb-6">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-[#141414] text-left">
                  <tr>
                    <th className="px-6 py-3 text-gray-500 dark:text-gray-400">
                      Car
                    </th>
                    <th className="px-6 py-3 text-gray-500 dark:text-gray-400">
                      Seller
                    </th>
                    <th className="px-6 py-3 text-gray-500 dark:text-gray-400">
                      Verified
                    </th>
                    <th className="px-6 py-3 text-gray-500 dark:text-gray-400">
                      Featured
                    </th>
                    <th className="px-6 py-3 text-gray-500 dark:text-gray-400">
                      Price
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {recentListings.map((item) => (
                    <tr
                      key={item._id}
                      className="border-t border-gray-200 dark:border-[#333333]"
                    >
                      <td className="px-6 py-4 text-black dark:text-white">
                        {item.title}
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                        {item.seller?.name || "Unknown"}
                      </td>
                      <td className="px-6 py-4">
                        {item.verified ? (
                          <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
                            Verified
                          </span>
                        ) : (
                          <span className="px-3 py-1 text-xs rounded-full bg-gray-200 text-gray-600">
                            No
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {item.featured ? (
                          <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
                            Featured
                          </span>
                        ) : (
                          <span className="px-3 py-1 text-xs rounded-full bg-gray-200 text-gray-600">
                            No
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-black dark:text-white">
                        {item.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ===== MOBILE CARDS ===== */}
            <div className="md:hidden p-4 pb-6 space-y-4">
              {recentListings.map((item) => (
                <div
                  key={item._id}
                  className="border border-gray-200 dark:border-[#333333] rounded-lg p-4"
                >
                  <p className="font-medium text-black dark:text-white">
                    {item.title}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Seller:{" "}
                    <span className="font-medium">
                      {item.seller?.name || "Unknown"}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500">{item.price}</p>

                  <div className="mt-2 flex gap-2 flex-wrap">
                    {item.verified && (
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                        Verified
                      </span>
                    )}
                    {item.featured && (
                      <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded">
                        Featured
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
