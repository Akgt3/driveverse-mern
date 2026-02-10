import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import CarCard from "../components/CarCard";

export default function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const { user, setWishlist } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchWishlist = async () => {
      try {
        const res = await fetch(
          "${import.meta.env.VITE_API_URL}/users/wishlist",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await res.json();
        setWishlistItems(data);

        // 🔑 keep global wishlist in sync
        setWishlist(data.map(item => item._id));
      } catch {
        toast.error("Failed to load wishlist");
      }
    };

    fetchWishlist();
  }, [user, setWishlist]);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A] pt-20">
      <div className="max-w-[1200px] mx-auto px-6 py-16">

        {/* HEADER */}
        <h1 className="text-[30px] font-semibold text-black dark:text-white">
          Wishlist
        </h1>
        <p className="mt-3 text-[12px] text-[#6B7280] dark:text-gray-400">
          Vehicles you’ve saved to revisit later.
        </p>

        {/* EMPTY STATE */}
        {wishlistItems.length === 0 && (
          <p className="mt-10 text-gray-500">
            You haven’t added any vehicles yet.
          </p>
        )}

        {/* ✅ SAME GRID + SAME CARD AS BUY PAGE */}
        <div
          className="
            mt-8
            grid grid-cols-1
            sm:grid-cols-2
            xl:grid-cols-3
            gap-6
          "
        >
          {wishlistItems.map(car => (
            <CarCard key={car._id} car={car} />
          ))}
        </div>

      </div>
    </div>
  );
}
