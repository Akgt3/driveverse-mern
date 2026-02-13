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

  // ✅ DEPLOYMENT-SAFE IMAGE URL BUILDER
  const getImageUrl = () => {
    if (!car.images || !Array.isArray(car.images) || car.images.length === 0) {
      return null;
    }

    const firstImage = car.images[0];
    if (!firstImage || typeof firstImage !== 'string') {
      return null;
    }

    // ✅ CLOUDINARY URL (starts with https://res.cloudinary.com)
    if (firstImage.startsWith('https://')) {
      return firstImage;
    }

    // ✅ CLOUDINARY URL (older format without https)
    if (firstImage.startsWith('http://')) {
      return firstImage.replace('http://', 'https://');
    }

    // ✅ RELATIVE PATH (local development only)
    if (firstImage.startsWith('/')) {
      return `${import.meta.env.VITE_API_URL}${firstImage}`;
    }

    // ✅ FALLBACK: Assume it's a Cloudinary URL without protocol
    if (firstImage.includes('cloudinary')) {
      return firstImage.startsWith('//') ? `https:${firstImage}` : `https://${firstImage}`;
    }

    return null;
  };

  const imageUrl = getImageUrl();

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
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={car.title || "Car image"}
            className="w-full h-[190px] object-cover"
            onError={(e) => {
              console.error("Image failed to load:", imageUrl);
              e.target.style.display = 'none';
              e.target.nextElementSibling.style.display = 'flex';
            }}
          />
        ) : null}

        {/* FALLBACK */}
        <div
          className="w-full h-[190px] bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400"
          style={{ display: imageUrl ? 'none' : 'flex' }}
        >
          <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>

        {/* WISHLIST */}
        {user && car.seller && user._id !== car.seller._id && (
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
          <span className="absolute top-2 left-2 bg-yellow-500 text-black text-[11px] font-medium px-2 py-[2px] rounded">
            FEATURED
          </span>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-4">
        <div className="text-[18px] font-semibold text-black dark:text-white">
          {car.price || "Price not available"}
        </div>

        <div className="mt-1 text-[15px] text-[#1F2933] dark:text-neutral-100 line-clamp-2">
          {car.title || "Untitled listing"}
        </div>

        <div className="mt-2 flex items-center gap-2">
          <SellerTypeBadge type={car.sellerType} />
        </div>

        <div className="mt-1 text-[13px] text-[#6B7280] dark:text-neutral-400">
          {car.year || "N/A"} · {car.km || "N/A"} km
        </div>

        {/* VERIFIED */}
        {car.verified && (
          <div className="mt-2 inline-flex items-center gap-1 text-[11px] px-2 py-[2px] bg-blue-500 text-white rounded">
            <FiCheckCircle size={12} />
            Verified Seller
          </div>
        )}

        <div className="mt-3 flex justify-between text-[12px] text-[#6B7280] dark:text-neutral-400">
          <span>{car.location || "Location not specified"}</span>
          <span>
            {car.createdAt
              ? new Date(car.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
              : "Date unknown"}
          </span>
        </div>

        <Link
          to={`/buy/${car._id}`}
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