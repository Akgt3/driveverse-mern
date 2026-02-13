import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { FiHeart, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import SellerTypeBadge from "../components/SellerTypeBadge";
import { useNavigate } from "react-router-dom";
import PageSkeleton from "../components/PageSkeleton";

export default function VehicleDetails() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ REAL-TIME POLLING FOR VERIFICATION STATUS
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/listings/${id}`);
        const data = await res.json();
        setListing(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();

    // ✅ POLL EVERY 2 SECONDS TO CHECK FOR ADMIN VERIFICATION CHANGES
    const interval = setInterval(fetchListing, 2000);

    return () => clearInterval(interval);
  }, [id]);

  const [activeImage, setActiveImage] = useState(0);
  const { user, wishlist, setWishlist } = useAuth();

  const isWishlisted = listing ? wishlist.includes(listing._id) : false;
  const isOwner = user && listing?.seller && user._id === listing.seller._id;

  const handleWishlist = async () => {
    if (!user) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/wishlist/${listing._id}`,
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
        isWishlisted
          ? prev.filter((id) => id !== listing._id)
          : [...prev, listing._id]
      );
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    setActiveImage(0);
  }, [id]);





  if (loading) {
    return <PageSkeleton type="vehicle-details" />;
  }





  if (!listing) {
    return (
      <div className="pt-24 text-center text-black dark:text-white">
        Vehicle not found
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#0A0A0A] pt-20">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT CONTENT */}
          <div className="flex-1 space-y-6">
            {/* IMAGE */}
            <div className="relative rounded-xl overflow-hidden bg-neutral-100 dark:bg-[#1a1a1a]">


              <img
                src={listing.images[activeImage].startsWith('https://')  // ✅ CORRECT
                  ? listing.images[activeImage]
                  : listing.images[activeImage].startsWith('http://')
                    ? listing.images[activeImage].replace('http://', 'https://')
                    : `${import.meta.env.VITE_API_URL}${listing.images[activeImage]}`} alt={listing.title}
                className="w-full h-[260px] sm:h-[380px] lg:h-[420px] object-cover"
              />
              {listing.images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setActiveImage(
                        activeImage === 0
                          ? listing.images.length - 1
                          : activeImage - 1
                      )
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/70 text-white p-2 rounded-full"
                  >
                    <FiChevronLeft />
                  </button>

                  <button
                    onClick={() =>
                      setActiveImage((activeImage + 1) % listing.images.length)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/70 text-white p-2 rounded-full"
                  >
                    <FiChevronRight />
                  </button>
                </>
              )}

              {user &&
                listing.seller &&
                user._id !== listing.seller._id && (
                  <button
                    onClick={handleWishlist}
                    className={`absolute top-3 right-3 p-2 rounded-full shadow transition-all ${isWishlisted
                      ? "bg-red-500 text-white scale-110"
                      : "bg-white dark:bg-[#141414]"
                      }`}
                  >
                    <FiHeart className={isWishlisted ? "fill-current" : ""} />
                  </button>
                )}
            </div>

            {/* THUMBNAILS */}
            <div className="flex gap-3 overflow-x-auto no-scrollbar">
              {listing.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`border rounded transition ${activeImage === i
                    ? "border-black dark:border-white"
                    : "border-gray-300 dark:border-neutral-700"
                    }`}
                >
                  <img
                    src={`${import.meta.env.VITE_API_URL}${img}`}
                    className="w-[84px] h-[56px] object-cover rounded"
                  />
                </button>
              ))}
            </div>

            {/* OVERVIEW */}
            <div className="bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-[#333333] rounded-xl p-5 space-y-5 shadow-sm">
              <h2 className="text-base font-semibold text-black dark:text-white">
                Overview
              </h2>

              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {listing.description}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                <Spec label="Brand" value={listing.brand} />
                <Spec label="Model" value={listing.model} />
                <Spec label="Year" value={listing.year} />
                <Spec label="Mileage" value={`${listing.km} km`} />
                <Spec label="FuelType" value={listing.fuel} />
                <Spec label="Transmission" value={listing.transmission} />
                <Spec label="BodyType" value={listing.body} />
                <Spec label="Engine" value={listing.engine} />
                <Spec label="Owners" value={listing.owners} />
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="w-full lg:w-[360px] space-y-5">
            {/* PRICE CARD */}
            <div className="bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-[#333333] rounded-xl p-5 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(listing.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>

              <h1 className="text-lg font-semibold text-black dark:text-white leading-snug">
                {listing.title}
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <SellerTypeBadge type={listing.sellerType} />
              </div>

              <p className="text-2xl font-bold text-black dark:text-white leading-none">
                {listing.price}
              </p>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  {listing.year}
                </span>
                <span className="font-medium text-gray-600 dark:text-gray-400">
                  {listing.km} km
                </span>
              </div>

              {/* ✅ VERIFIED BADGE - UPDATES IN REAL-TIME */}
              {listing.verified && (
                <span className="inline-block text-xs px-2 py-1 rounded bg-black text-white dark:bg-white dark:text-black w-fit">
                  Verified Seller
                </span>
              )}
            </div>

            {/* SELLER / CHAT PROFILE */}
            <div className="bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-[#333333] rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={listing.seller.avatar || "/avatar-placeholder.png"}
                  alt={listing.seller.name}
                  className="w-12 h-12 rounded-full object-cover"
                />

                <div>
                  <p className="font-medium text-black dark:text-white">
                    {listing.seller.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {listing.location}
                  </p>
                </div>
              </div>

              {!isOwner && user && (
                <button
                  onClick={() => navigate(`/chat/${listing.seller._id}`)}
                  className="w-full py-2 rounded-md border border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition"
                >
                  Chat with seller
                </button>
              )}
            </div>

            {/* MAP */}
            <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-neutral-700">
              <iframe
                className="w-full h-[220px]"
                src={`https://maps.google.com/maps?q=${listing.location}&z=13&output=embed`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Spec({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      <p className="font-medium text-black dark:text-white">{value}</p>
    </div>
  );
}
