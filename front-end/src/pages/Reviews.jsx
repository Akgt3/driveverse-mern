import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { FiTrash2 } from "react-icons/fi";
import PageSkeleton from "../components/PageSkeleton";

export default function Reviews() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    rating: 5,
    message: "",
  });

  /* ================= FETCH REVIEWS ================= */
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL} / api / reviews`);
        const data = await res.json();
        setReviews(data);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  /* ================= SUBMIT REVIEW ================= */
  const submitReview = async () => {
    if (!form.message) {
      toast.error("Please write a message");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL} / api / reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          rating: form.rating,
          message: form.message,
        }),
      });

      const savedReview = await res.json();

      if (!res.ok) throw new Error(savedReview.message);

      setReviews([savedReview, ...reviews]);
      setForm({ name: "", rating: 5, message: "" });
      setOpen(false);
      toast.success("Review posted successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to post review");
    }
  };

  /* ================= DELETE REVIEW ================= */
  const deleteReview = async (reviewId) => {
    if (!window.confirm("Delete this review permanently?")) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL} / api / reviews / ${reviewId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setReviews((prev) => prev.filter((review) => review._id !== reviewId));
      toast.success("Review deleted successfully");
    } catch (err) {
      toast.error(err.message || "Failed to delete review");
    }
  };

  if (loading) {
    return <PageSkeleton type="reviews" />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A] transition-colors pt-18">
      <div className="max-w-[1200px] mx-auto px-6 py-16">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[36px] font-semibold text-black dark:text-white">
              User Reviews
            </h1>
            <p className="mt-3 text-[16px] text-gray-600 dark:text-gray-400 max-w-[600px]">
              Real experiences shared by buyers and sellers across India.
            </p>
          </div>

          <button
            onClick={() => {
              if (!user) {
                toast.error("Please login to post a review");
                navigate("/auth");
                return;
              }
              setOpen(true);
            }}
            className="
              px-4 py-2 text-xs
              sm:px-6 sm:py-3 sm:text-sm
              rounded-lg
              bg-black text-white
              dark:bg-white dark:text-black
              font-medium
              hover:opacity-90 transition
            "
          >
            Add Review
          </button>
        </div>

        {/* REVIEWS GRID */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.length === 0 ? (
            <div className="col-span-2 text-center py-20">
              <p className="text-gray-500 dark:text-gray-400">
                No reviews yet. Be the first to share your experience!
              </p>
            </div>
          ) : (
            reviews.map((review) => (
              <div
                key={review._id}
                className="
                  bg-white dark:bg-[#121212]
                  border border-gray-200 dark:border-[#333333]
                  rounded-lg p-6
                  relative
                "
              >
                {/* DELETE BUTTON - Only show for review owner */}
                {user && review.userId === user._id && (
                  <button
                    onClick={() => deleteReview(review._id)}
                    className="
    absolute top-23 right-4
    w-8 h-8
    flex items-center justify-center
    rounded-full
    text-red-500
    hover:bg-red-50 dark:hover:bg-red-900/20
    hover:scale-105
    active:scale-95
    transition-all duration-200
  "
                    title="Delete review"
                  >
                    <FiTrash2 size={16} />
                  </button>
                )}

                <div className="flex items-center gap-4 mb-3">
                  {/* PROFILE PIC */}
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-black dark:text-white">
                        {review.name}
                      </p>
                      <span className="text-sm text-gray-500">
                        {"⭐".repeat(review.rating)}
                      </span>
                    </div>

                    <p className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <p className="text-gray-700 dark:text-gray-300 leading-7">
                  "{review.message}"
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ADD REVIEW MODAL */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/60"
          />

          <div
            className="
              relative w-full max-w-[420px] mx-4
              bg-white dark:bg-[#121212]
              rounded-xl p-6 z-10
            "
          >
            <h2 className="text-xl font-semibold text-black dark:text-white mb-4">
              Add Your Review
            </h2>

            <select
              value={form.rating}
              onChange={(e) =>
                setForm({ ...form, rating: Number(e.target.value) })
              }
              className="
                w-full mb-3 px-4 py-2 rounded-md
                border border-gray-300 dark:border-[#333333]
                bg-white dark:bg-[#121212]
                text-black dark:text-white
                outline-none
              "
            >
              <option value={5}>⭐⭐⭐⭐⭐ (5)</option>
              <option value={4}>⭐⭐⭐⭐ (4)</option>
              <option value={3}>⭐⭐⭐ (3)</option>
              <option value={2}>⭐⭐ (2)</option>
              <option value={1}>⭐ (1)</option>
            </select>

            <textarea
              rows={4}
              placeholder="Write your experience..."
              value={form.message}
              onChange={(e) =>
                setForm({ ...form, message: e.target.value })
              }
              className="
                w-full mb-4 px-4 py-2 rounded-md
                border border-gray-300 dark:border-[#333333]
                bg-white dark:bg-[#121212]
                text-black dark:text-white
                outline-none
              "
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 text-sm text-gray-500 hover:text-black dark:hover:text-white transition"
              >
                Cancel
              </button>

              <button
                onClick={submitReview}
                className="
                  px-5 py-2 rounded-md
                  bg-black text-white
                  dark:bg-white dark:text-black
                  text-sm font-medium
                  hover:opacity-90 transition
                "
              >
                Post Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}