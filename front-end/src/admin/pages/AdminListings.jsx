import { useState, useEffect } from "react";
import { FiTrash2, FiStar, FiCheckCircle } from "react-icons/fi";
import AdminLayout from "../layout/AdminLayout";
import toast from "react-hot-toast";

export default function AdminListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/listings", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      setListings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load listings");
      toast.error("Failed to load listings");
    } finally {
      setLoading(false);
    }
  };

  const toggleFeatured = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/listings/admin/feature/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // ✅ UPDATE LOCAL STATE
      setListings((prev) =>
        prev.map((listing) =>
          listing._id === id
            ? { ...listing, featured: data.featured }
            : listing
        )
      );

      toast.success(data.message);
    } catch (err) {
      toast.error(err.message || "Failed to update listing");
    }
  };

  const toggleVerified = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/listings/admin/verify/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // ✅ UPDATE LOCAL STATE
      setListings((prev) =>
        prev.map((listing) =>
          listing._id === id
            ? { ...listing, verified: data.verified }
            : listing
        )
      );

      toast.success(data.message);
    } catch (err) {
      toast.error(err.message || "Failed to update listing");
    }
  };

  const deleteListing = async (id) => {
    if (!window.confirm("Delete this listing permanently?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/listings/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // ✅ REMOVE FROM LOCAL STATE
      setListings((prev) => prev.filter((listing) => listing._id !== id));

      toast.success("Listing deleted successfully");
    } catch (err) {
      toast.error(err.message || "Failed to delete listing");
    }
  };

  return (
    <AdminLayout>
      <div className="pt-12 px-6 pb-12 max-w-[1400px] mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-black dark:text-white">
            Listings Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Review, verify, feature, and manage all car listings
          </p>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading listings...</p>
        ) : (
          <>
            {/* ================= DESKTOP TABLE ================= */}
            <div className="hidden md:block bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-[#333333] rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-[#141414] text-left">
                  <tr className="text-gray-600 dark:text-gray-400">
                    <th className="p-4">Car</th>
                    <th>Seller</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th className="text-right p-4">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {listings.map((car) => (
                    <tr
                      key={car._id}
                      className="border-t border-gray-200 dark:border-[#333333]"
                    >
                      {/* CAR */}
                      <td className="p-4 flex items-center gap-3">
                        <img
                          src={`http://localhost:5000${car.images[0]}`}
                          className="w-16 h-11 rounded object-cover"
                          alt={car.title}
                        />
                        <div>
                          <p className="font-medium text-black dark:text-white">
                            {car.title}
                          </p>
                          <p className="text-xs text-gray-500">{car.price}</p>
                        </div>
                      </td>

                      {/* SELLER */}
                      <td>
                        <p className="font-medium text-black dark:text-white">
                          {car.seller?.name || "Unknown"}
                        </p>
                      </td>

                      {/* LOCATION */}
                      <td className="text-gray-600 dark:text-gray-400">
                        {car.location}
                      </td>

                      {/* STATUS */}
                      <td>
                        <div className="flex flex-col gap-1">
                          {car.verified && (
                            <span className="inline-flex items-center gap-1 text-xs px-2 py-[2px] rounded bg-blue-500 text-white w-fit">
                              <FiCheckCircle size={12} />
                              Verified
                            </span>
                          )}
                          {car.featured && (
                            <span className="inline-flex items-center gap-1 text-xs px-2 py-[2px] rounded bg-yellow-400 text-black w-fit">
                              <FiStar size={12} />
                              Featured
                            </span>
                          )}
                          {!car.verified && !car.featured && (
                            <span className="text-gray-400 text-xs">—</span>
                          )}
                        </div>
                      </td>

                      {/* ACTIONS */}
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => toggleFeatured(car._id)}
                            className={`p-2 rounded-md transition ${car.featured
                                ? "bg-yellow-100 text-yellow-600"
                                : "text-yellow-500 hover:bg-yellow-50"
                              } dark:hover:bg-[#1A1A1A]`}
                            title={
                              car.featured ? "Remove featured" : "Make featured"
                            }
                          >
                            <FiStar />
                          </button>

                          <button
                            onClick={() => toggleVerified(car._id)}
                            className={`p-2 rounded-md transition ${car.verified
                                ? "bg-blue-100 text-blue-600"
                                : "text-blue-500 hover:bg-blue-50"
                              } dark:hover:bg-[#1A1A1A]`}
                            title={car.verified ? "Unverify" : "Verify"}
                          >
                            <FiCheckCircle />
                          </button>

                          <button
                            onClick={() => deleteListing(car._id)}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-[#1A1A1A] rounded-md transition"
                            title="Delete listing"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ================= MOBILE CARDS ================= */}
            <div className="md:hidden space-y-4">
              {listings.map((car) => (
                <div
                  key={car._id}
                  className="bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-[#333333] rounded-xl p-4"
                >
                  <div className="flex gap-3">
                    <img
                      src={`http://localhost:5000${car.images[0]}`}
                      className="w-24 h-16 rounded object-cover"
                      alt={car.title}
                    />

                    <div className="flex-1">
                      <p className="font-medium text-black dark:text-white">
                        {car.title}
                      </p>

                      <p className="text-sm text-gray-500">{car.price}</p>

                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Seller:{" "}
                        <span className="font-medium">
                          {car.seller?.name || "Unknown"}
                        </span>
                      </p>

                      <p className="text-xs text-gray-500">{car.location}</p>

                      <div className="mt-2 flex gap-2 flex-wrap">
                        {car.verified && (
                          <span className="text-xs px-2 py-[2px] bg-blue-500 text-white rounded">
                            Verified
                          </span>
                        )}

                        {car.featured && (
                          <span className="text-xs px-2 py-[2px] bg-yellow-400 text-black rounded">
                            Featured
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="mt-4 flex justify-end gap-3">
                    <button
                      onClick={() => toggleFeatured(car._id)}
                      className={`p-2 rounded-md ${car.featured
                          ? "bg-yellow-100 text-yellow-600"
                          : "text-yellow-500"
                        }`}
                    >
                      <FiStar />
                    </button>

                    <button
                      onClick={() => toggleVerified(car._id)}
                      className={`p-2 rounded-md ${car.verified
                          ? "bg-blue-100 text-blue-600"
                          : "text-blue-500"
                        }`}
                    >
                      <FiCheckCircle />
                    </button>

                    <button
                      onClick={() => deleteListing(car._id)}
                      className="p-2 text-red-500"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
