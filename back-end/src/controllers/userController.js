import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Listing from "../models/Listing.js";

export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id);

  // ❌ Google users blocked
  if (user.authProvider === "google") {
    return res
      .status(403)
      .json({ message: "Google users cannot change password" });
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Current password incorrect" });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.json({ message: "Password updated successfully" });
};

// ================= ADMIN: BLOCK / UNBLOCK USER =================
export const toggleUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🚫 Prevent blocking admin
    if (user.role === "admin") {
      return res.status(403).json({ message: "Cannot block admin" });
    }

    user.status = user.status === "active" ? "blocked" : "active";
    await user.save();

    res.json({
      message: `User ${user.status === "blocked" ? "blocked" : "unblocked"}`,
      status: user.status,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to update user status" });
  }
};

export const toggleWishlist = async (req, res) => {
  const user = await User.findById(req.user._id);
  const listingId = req.params.listingId;

  // ✅ STEP 1: CHECK LISTING EXISTS
  const listing = await Listing.findById(listingId);
  if (!listing) {
    return res.status(404).json({ message: "Listing not found" });
  }

  // ❌ STEP 2: SELLER CANNOT WISHLIST OWN LISTING
  if (listing.seller.toString() === user._id.toString()) {
    return res
      .status(403)
      .json({ message: "Cannot wishlist your own listing" });
  }

  // ✅ STEP 3: TOGGLE
  const alreadySaved = user.wishlist.some((id) => id.toString() === listingId);

  if (alreadySaved) {
    user.wishlist.pull(listingId);
  } else {
    user.wishlist.push(listingId);
  }

  await user.save();

  res.json({
    message: alreadySaved ? "Removed from wishlist" : "Added to wishlist",
  });
};

export const getWishlist = async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: "wishlist",
    populate: {
      path: "seller",
      select: "name avatar _id",
    },
  });

  res.json(user.wishlist);
};

/* ================= ADMIN: GET USER STATS ================= */
export const getUserStats = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }

    const totalUsers = await User.countDocuments({ role: "user" });
    const activeUsers = await User.countDocuments({
      role: "user",
      status: "active",
    });
    const blockedUsers = await User.countDocuments({
      role: "user",
      status: "blocked",
    });

    res.json({
      totalUsers,
      activeUsers,
      blockedUsers,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user stats" });
  }
};