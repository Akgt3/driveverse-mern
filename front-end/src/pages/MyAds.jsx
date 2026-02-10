import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { FiEdit2, FiTrash2, FiCheckCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import SellerTypeBadge from "../components/SellerTypeBadge";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";

export default function MyAds() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyAds = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/listings/my-ads", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();
        setAds(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyAds();

    // ✅ POLL EVERY 2 SECONDS TO CHECK FOR ADMIN VERIFICATION CHANGES
    const interval = setInterval(fetchMyAds, 2000);

    return () => clearInterval(interval);
  }, [location.key]);

  const deleteAd = async (id) => {
    if (!confirm("Delete this ad permanently?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/listings/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // 🔥 THIS LINE FIXES EVERYTHING
      setAds((prev) => prev.filter((ad) => ad._id !== id));

      toast.success("Ad deleted permanently");
    } catch (err) {
      toast.error(err.message || "Delete failed");
    }
  };

  return (
    <section className="py-24 bg-white dark:bg-[#0A0A0A] min-h-screen">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* HEADER */}
        <div className="mb-6">
          <h2 className="text-[28px] font-semibold text-[#1F2933] dark:text-white">
            My Ads
          </h2>
          <p className="mt-1 text-[14px] text-[#6B7280] dark:text-gray-400">
            Manage your listings
          </p>
        </div>
        {loading && <p className="mt-10 text-gray-500">Loading your ads…</p>}
        {!loading && ads.length === 0 && (
          <p className="mt-10 text-gray-500">
            You haven't posted any ads yet.
          </p>
        )}

        {/* SAME CARD DESIGN */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ads.map((car) => (
            <div
              key={car._id}
              className="
                border border-gray-200 dark:border-[#1F1F1F]
                rounded-lg overflow-hidden
                bg-white dark:bg-[#0F0F0F]
                shadow-md
              "
            >
              {/* IMAGE */}
              <div className="relative">
                <img
                  src={`http://localhost:5000${car.images[0]}`}
                  className="w-full h-[190px] object-cover"
                  alt={car.title}
                />

                {car.featured && (
                  <span className="absolute top-2 left-2 bg-yellow-500 text-black text-[11px] px-2 py-[2px] rounded">
                    FEATURED
                  </span>
                )}
              </div>

              {/* CONTENT */}
              <div className="p-4">
                <div className="text-[18px] font-semibold text-black dark:text-white">
                  {car.price}
                </div>
                <div className="mt-2">
                  <SellerTypeBadge type={car.sellerType} />
                </div>

                <div className="mt-1 text-[15px] text-[#1F2933] dark:text-gray-100">
                  {car.title}
                </div>

                <div className="mt-1 text-[13px] text-[#6B7280] dark:text-gray-400">
                  {car.year} · {car.km} km
                </div>

                {/* ✅ VERIFIED BADGE - NOW DYNAMIC */}
                {car.verified && (
                  <div className="mt-2 inline-flex items-center gap-1 text-[11px] px-2 py-[2px] bg-blue-500 text-white rounded">
                    <FiCheckCircle size={12} />
                    Verified Seller
                  </div>
                )}

                <div className="mt-3 flex items-center justify-between text-[12px] text-[#6B7280] dark:text-gray-400">
                  <span>{car.location}</span>
                  <span>
                    {new Date(car.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                {/* SELLER ACTIONS */}
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => navigate(`/edit-ad/${car._id}`)}
                    className="
                      flex-1 flex items-center justify-center gap-2
                      h-[36px] border border-black dark:border-white
                      text-black dark:text-white text-sm
                    "
                  >
                    <FiEdit2 /> Edit
                  </button>

                  <button
                    onClick={() => deleteAd(car._id)}
                    className="
                      flex-1 flex items-center justify-center gap-2
                      h-[36px] border border-red-500
                      text-red-500 text-sm
                    "
                  >
                    <FiTrash2 /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
