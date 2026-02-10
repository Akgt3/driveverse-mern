import express from "express";
import Review from "../models/Review.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

/* GET ALL REVIEWS */
router.get("/", async (req, res) => {
  const reviews = await Review.find().sort({ createdAt: -1 });
  res.json(reviews);
});

/* ADD REVIEW */
router.post("/", protect, async (req, res) => {
  const { rating, message } = req.body;

  if (!message) {
    return res.status(400).json({ message: "Message required" });
  }

  const review = await Review.create({
    name: req.user.name,
    rating,
    message,
    avatar: req.user.avatar,
    userId: req.user._id, // ✅ SAVE USER ID
  });

  res.status(201).json(review);
});

/* ✅ DELETE REVIEW (NEW) */
router.delete("/:id", protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check ownership
    if (review.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await review.deleteOne();
    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    console.error("Delete review error:", err);
    res.status(500).json({ message: "Failed to delete review" });
  }
});

export default router;