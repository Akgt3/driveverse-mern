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
router.post("/", protect, upload.array("images", 10), async (req, res) => {
  try {
    console.log("📤 CREATE LISTING REQUEST");
    console.log("User:", req.user._id);
    console.log("Files:", req.files?.length || 0);
    console.log("Body:", req.body);

    // ✅ CHECK CLOUDINARY CONFIG FIRST
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error("❌ CLOUDINARY NOT CONFIGURED");
      return res.status(500).json({
        message: "Image upload service not configured. Please contact support."
      });
    }

    // ✅ CHECK BLOCKED
    if (req.user.status === "blocked") {
      return res.status(403).json({ message: "Account blocked" });
    }

    // ✅ CHECK FILES
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "At least one image is required" });
    }

    // ✅ GET IMAGE PATHS - Cloudinary only
    const imagePaths = req.files.map(file => {
      if (!file.path) {
        throw new Error("Cloudinary upload failed - no file path returned");
      }
      console.log("✅ Cloudinary uploaded:", file.path);
      return file.path; // This is the Cloudinary URL
    });

    console.log("✅ Total images uploaded:", imagePaths.length);

    // ✅ VALIDATE REQUIRED FIELDS
    if (!req.body.brand || !req.body.model || !req.body.price || !req.body.location) {
      return res.status(400).json({
        message: "Missing required fields: brand, model, price, location"
      });
    }

    // ✅ CREATE LISTING
    const listing = await Listing.create({
      title: `${req.body.brand} ${req.body.model}`.trim(),
      price: req.body.price,
      location: req.body.location,
      year: req.body.year,
      km: req.body.km,
      brand: req.body.brand,
      model: req.body.model,
      fuel: req.body.fuel,
      transmission: req.body.transmission,
      description: req.body.description,
      engine: req.body.engine,
      owners: req.body.owners,
      body: req.body.body,
      sellerType: req.body.sellerType,
      images: imagePaths, // Cloudinary URLs
      seller: req.user._id,
    });

    console.log("✅ Listing created successfully:", listing._id);

    return res.status(201).json(listing);

  } catch (err) {
    console.error("❌ CREATE LISTING ERROR:", err.message);
    console.error("Full error:", err);

    // ✅ CRITICAL FIX: Explicitly set JSON header
    res.setHeader('Content-Type', 'application/json');

    // ✅ Return proper JSON error
    return res.status(500).json({
      message: err.message || "Failed to create listing",
      details: process.env.NODE_ENV === "development" ? err.stack : "Please try again or contact support"
    });
  }
});

/* ================= MY ADS ================= */
router.get("/my-ads", protect, async (req, res) => {
  try {
    const listings = await Listing.find({ seller: req.user._id });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ================= GET ALL ================= */
router.get("/", async (req, res) => {
  try {
    const listings = await Listing.find().populate("seller");
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
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
  } catch (err) {
    res.status(400).json({ message: "Invalid listing ID" });
  }
});

/* ================= UPDATE ================= */
router.put("/:id", protect, upload.array("images", 10), async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (listing.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Update text fields
    Object.assign(listing, req.body);

    // ✅ HANDLE IMAGES
    let finalImages = [];

    // Parse existing images
    if (req.body.existingImages) {
      try {
        const existingImages = JSON.parse(req.body.existingImages);
        finalImages = Array.isArray(existingImages) ? existingImages : [];
      } catch (err) {
        console.error("Error parsing existingImages:", err);
      }
    }

    // Add new uploaded images (Cloudinary URLs)
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => file.path);
      finalImages = [...finalImages, ...newImages];
    }

    listing.images = finalImages;
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
  try {
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
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ================= ADMIN: TOGGLE VERIFIED ================= */
router.patch("/admin/verify/:id", protect, toggleVerified);

/* ================= ADMIN: TOGGLE FEATURED ================= */
router.patch("/admin/feature/:id", protect, toggleFeatured);

/* ================= TEST ROUTE ================= */
router.post("/test", protect, async (req, res) => {
  try {
    res.json({
      message: "Test successful",
      user: req.user._id,
      cloudinary: {
        name: process.env.CLOUDINARY_CLOUD_NAME,
        configured: !!process.env.CLOUDINARY_API_KEY
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;