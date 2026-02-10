import { useState } from "react";
import { FiChevronLeft, FiChevronRight, FiHeart } from "react-icons/fi";

export default function ImageGallery({ images = [], user, isOwner }) {
  const [active, setActive] = useState(0);

  if (!images.length) return null;

  return (
    <div>
      {/* MAIN IMAGE */}
      <div className="relative rounded-lg overflow-hidden bg-black">

        <img
          src={`http://localhost:5000${images[active]}`}
          className="w-full h-[460px] object-cover"
          alt="Vehicle"
        />

        {/* LEFT ARROW */}
        {images.length > 1 && (
          <button
            onClick={() =>
              setActive(active > 0 ? active - 1 : images.length - 1)
            }
            className="absolute left-3 top-1/2 -translate-y-1/2
              bg-black/60 text-white p-2 rounded-full"
          >
            <FiChevronLeft size={20} />
          </button>
        )}

        {/* RIGHT ARROW */}
        {images.length > 1 && (
          <button
            onClick={() => setActive((active + 1) % images.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2
              bg-black/60 text-white p-2 rounded-full"
          >
            <FiChevronRight size={20} />
          </button>
        )}

        {/* WISHLIST */}
        {user && !isOwner && (
          <button
            className="absolute top-3 right-3
              bg-white dark:bg-[#141414]
              p-2 rounded-full shadow
              hover:scale-105 transition"
            title="Add to wishlist"
          >
            <FiHeart className="text-black dark:text-white" />
          </button>
        )}

      </div>

      {/* THUMBNAILS */}
      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`border rounded transition
                ${i === active
                  ? "border-black dark:border-white"
                  : "border-gray-300 dark:border-neutral-700"
                }`}
            >
              <img
                src={`http://localhost:5000${img}`}
                className="h-20 w-28 object-cover rounded"
                alt="thumb"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
