import { RiHeartAddFill } from "react-icons/ri";
import { FiCheckCircle } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import SellerTypeBadge from "./SellerTypeBadge";

export default function CarCard({ car }) {
  const navigate = useNavigate();

  const { user, wishlist, setWishlist } = useAuth();

  const isWishlisted = wishlist.includes(car._id);

  const handleWishlist = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    if (user._id === car.seller._id) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/wishlist/${car._id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setWishlist((prev) =>
        isWishlisted ? prev.filter((id) => id !== car._id) : [...prev, car._id]
      );

      toast.success(data.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div
      className="
        border border-gray-200 dark:border-[#1F1F1F]
        rounded-lg overflow-hidden
        bg-white dark:bg-[#0F0F0F]
        shadow-md hover:shadow-lg
        transition
      "
    >
      {/* IMAGE */}
      <div className="relative">
        <img
          src={car.images[0].startsWith('http')
            ? car.images[0]  // Cloudinary URL
            : `${import.meta.env.VITE_API_URL}${car.images[0]}`}
          alt={car.title}
          className="w-full h-[190px] object-cover"
        />

        {/* WISHLIST — hide for seller */}
        {user && user._id !== car.seller._id && (
          <button
            onClick={handleWishlist}
            className={`
              absolute top-2 right-2
              w-8 h-8 rounded-full
              flex items-center justify-center
              shadow transition-all
              ${isWishlisted
                ? "bg-red-500 text-white scale-110"
                : "bg-white dark:bg-[#121212] text-black dark:text-white"
              }
              active:scale-90
            `}
          >
            <RiHeartAddFill
              className={`transition ${isWishlisted ? "animate-pulse" : ""}`}
            />
          </button>
        )}

        {/* FEATURED */}
        {car.featured && (
          <span
            className="
              absolute top-2 left-2
              bg-yellow-500 text-black
              text-[11px] font-medium
              px-2 py-[2px]
              rounded
            "
          >
            FEATURED
          </span>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-4">
        <div className="text-[18px] font-semibold text-black dark:text-white">
          {car.price}
        </div>

        <div className="mt-1 text-[15px] text-[#1F2933] dark:text-neutral-100 line-clamp-2">
          {car.title}
        </div>
        <div className="mt-2 flex items-center gap-2">
          <SellerTypeBadge type={car.sellerType} />
        </div>

        <div className="mt-1 text-[13px] text-[#6B7280] dark:text-neutral-400">
          {car.year} · {car.km} km
        </div>

        {/* VERIFIED BADGE */}
        {car.verified && (
          <div className="mt-2 inline-flex items-center gap-1 text-[11px] px-2 py-[2px] bg-blue-500 text-white rounded">
            <FiCheckCircle size={12} />
            Verified Seller
          </div>
        )}

        <div className="mt-3 flex justify-between text-[12px] text-[#6B7280] dark:text-neutral-400">
          <span>{car.location}</span>
          <span>
            {new Date(car.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>

        <Link
          to={`/buy/${car._id}`}
          onClick={() => console.log("CLICKED ID:", car._id)}
          className="
            mt-4 block text-center h-[38px] leading-[38px]
            border border-black dark:border-white
            text-black dark:text-white
            hover:bg-black hover:text-white
            dark:hover:bg-white dark:hover:text-black
            transition
          "
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
