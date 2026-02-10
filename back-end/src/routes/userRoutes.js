import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  changePassword,
  toggleWishlist,
  getWishlist,
  getUserStats,
} from "../controllers/userController.js";
import User from "../models/User.js";

const router = express.Router();

/* ================= ADMIN USER STATS ================= */
router.get("/admin/stats", protect, getUserStats);

/* ================= CURRENT USER PROFILE ================= */
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("name avatar place");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      name: user.name,
      avatar: user.avatar,
      location: user.place,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to load profile" });
  }
});

/* ================= ✅ ADMIN GET ALL USERS (FIXED) ================= */
router.get("/admin/all", protect, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }

  // ✅ INCLUDE STATUS FIELD
  const users = await User.find().select("name email role status createdAt");

  res.json(users);
});

/* ================= OTHER USER PROFILE (CHAT / LISTING) ================= */
router.get("/profile/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("name avatar place");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      name: user.name,
      avatar: user.avatar,
      location: user.place,
    });
  } catch (err) {
    res.status(400).json({ message: "Invalid user ID" });
  }
});

/* ================= ACCOUNT ================= */
router.put("/change-password", protect, changePassword);

/* ================= WISHLIST ================= */
router.post("/wishlist/:listingId", protect, toggleWishlist);
router.get("/wishlist", protect, getWishlist);

/* ================= 🔥 ADMIN BLOCK / UNBLOCK USER (FIXED) ================= */
router.patch("/admin/status/:id", protect, async (req, res) => {
  try {
    // 🔐 Admin only
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🚫 Cannot block admin
    if (user.role === "admin") {
      return res.status(403).json({ message: "Cannot block admin account" });
    }

    // 🔁 Toggle status
    const newStatus = user.status === "blocked" ? "active" : "blocked";
    user.status = newStatus;
    await user.save();

    // 🔥 LIVE BLOCK - Emit socket event IMMEDIATELY
    if (newStatus === "blocked") {
      const io = req.app.get("io");

      console.log(`🚫 Blocking user ${user._id} - emitting socket event`);

      // ✅ Emit to user's personal room
      io.to(user._id.toString()).emit("accountBlocked", {
        message: "Your account has been blocked by an administrator",
      });

      console.log(`✅ Socket event sent to room: ${user._id.toString()}`);
    }

    // ✅ RETURN CONSISTENT STATUS
    res.json({
      message: `User ${newStatus === "blocked" ? "blocked" : "unblocked"
        } successfully`,
      status: newStatus, // ✅ Return the actual DB status ("active" or "blocked")
    });
  } catch (err) {
    console.error("Block user error:", err);
    res.status(500).json({ message: "Failed to update user status" });
  }
});

export default router;