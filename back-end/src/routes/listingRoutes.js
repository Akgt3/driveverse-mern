import express from "express";
import protect from "../middleware/authMiddleware.js";
import Listing from "../models/Listing.js";
import upload from "../middleware/uploadMiddleware.js";
import {
  toggleVerified,
  toggleFeatured,
  getAdminStats,
} from "../controllers/listingController.js";

const router = express.Router();

/* ================= ADMIN STATS ================= */
router.get("/admin/stats", protect, getAdminStats);

/* ================= CREATE ================= */
router.post("/", protect, upload.array("images"), async (req, res) => {
  try {
    const imagePaths =
      req.files?.map((file) => `/uploads/${file.filename}`) || [];

    const listing = await Listing.create({
      ...req.body,
      images: imagePaths,
      seller: req.user._id,
    });

    res.status(201).json(listing);
  } catch {
    res.status(500).json({ message: "Failed to create listing" });
  }
});

/* ================= MY ADS ================= */
router.get("/my-ads", protect, async (req, res) => {
  const listings = await Listing.find({ seller: req.user._id });
  res.json(listings);
});

/* ================= GET ALL ================= */
router.get("/", async (req, res) => {
  const listings = await Listing.find().populate("seller");
  res.json(listings);
});

/* ================= GET SINGLE ================= */
router.get("/:id", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate(
      "seller",
      "name email avatar"
    );

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.json(listing);
  } catch {
    res.status(400).json({ message: "Invalid listing ID" });
  }
});

/* ================= ✅ UPDATE (FIXED IMAGE HANDLING) ================= */
router.put("/:id", protect, upload.array("images"), async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (listing.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // ✅ UPDATE TEXT FIELDS
    Object.assign(listing, req.body);

    // ✅ HANDLE IMAGES PROPERLY
    let finalImages = [];

    // 1️⃣ Get existing images from request (images user wants to keep)
    if (req.body.existingImages) {
      try {
        const existingImages = JSON.parse(req.body.existingImages);
        finalImages = Array.isArray(existingImages) ? existingImages : [];
      } catch (err) {
        console.error("Error parsing existingImages:", err);
        finalImages = [];
      }
    }

    // 2️⃣ Add new uploaded images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => `/uploads/${file.filename}`);
      finalImages = [...finalImages, ...newImages];
    }

    // 3️⃣ Update listing images
    listing.images = finalImages;

    // ✅ REBUILD TITLE
    listing.title = `${listing.brand} ${listing.model}`.trim();

    await listing.save();

    res.json(listing);
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

/* ================= DELETE ================= */
router.delete("/:id", protect, async (req, res) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return res.status(404).json({ message: "Listing not found" });
  }

  if (
    listing.seller.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({ message: "Not authorized" });
  }

  await listing.deleteOne();
  res.json({ message: "Listing deleted" });
});

/* ================= ADMIN: TOGGLE VERIFIED ================= */
router.patch("/admin/verify/:id", protect, toggleVerified);

/* ================= ADMIN: TOGGLE FEATURED ================= */
router.patch("/admin/feature/:id", protect, toggleFeatured);

export default router;