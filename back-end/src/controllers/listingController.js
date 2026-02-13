import Listing from "../models/Listing.js";

/* ================= CREATE ================= */
export const createListing = async (req, res) => {
  try {
    if (req.user.status === "blocked") {
      return res.status(403).json({ message: "Account blocked" });
    }

    // ✅ VALIDATE CLOUDINARY SETUP
    if (!process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET) {
      console.error("❌ CLOUDINARY NOT CONFIGURED");
      return res.status(500).json({
        message: "Image upload service not configured. Please contact support."
      });
    }

    // ✅ CHECK IF FILES UPLOADED
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: "At least one image is required"
      });
    }

    // ✅ GET IMAGE URLS FROM CLOUDINARY
    const imageUrls = req.files.map(file => file.path);

    console.log("✅ Images uploaded:", imageUrls.length);

    const listing = await Listing.create({
      ...req.body,
      images: imageUrls,
      seller: req.user._id,
    });

    res.status(201).json(listing);

  } catch (error) {
    console.error("❌ Create listing error:", error);

    // ✅ SEND PROPER JSON ERROR
    res.status(500).json({
      message: error.message || "Failed to create listing. Please try again."
    });
  }
};

/* ================= READ ================= */
export const getAllListings = async (req, res) => {
  const listings = await Listing.find()
    .populate("seller", "name avatar")
    .sort({ createdAt: -1 });

  res.json(listings);
};

export const getSingleListing = async (req, res) => {
  const listing = await Listing.findById(req.params.id)
    .populate("seller", "name avatar");

  if (!listing) {
    return res.status(404).json({ message: "Listing not found" });
  }

  res.json(listing);
};

/* ================= UPDATE ================= */
export const updateListing = async (req, res) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return res.status(404).json({ message: "Listing not found" });
  }

  // 🔒 OWNER CHECK
  if (listing.seller.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized" });
  }

  Object.assign(listing, req.body);

  // 🔥 REBUILD TITLE
  if (req.body.brand || req.body.model) {
    listing.title = `${listing.brand} ${listing.model}`.trim();
  }

  await listing.save();

  res.json(listing);
};

/* ================= DELETE ================= */
export const deleteListing = async (req, res) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return res.status(404).json({ message: "Listing not found" });
  }

  // 🔒 OWNER OR ADMIN
  if (
    listing.seller.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({ message: "Not authorized" });
  }

  await listing.deleteOne();
  res.json({ message: "Listing deleted" });
};

/* ================= ADMIN: TOGGLE VERIFIED ================= */
export const toggleVerified = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }

    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    listing.verified = !listing.verified;
    await listing.save();

    res.json({
      message: `Listing ${listing.verified ? "verified" : "unverified"}`,
      verified: listing.verified,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to update listing" });
  }
};

/* ================= ADMIN: TOGGLE FEATURED ================= */
export const toggleFeatured = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }

    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    listing.featured = !listing.featured;
    await listing.save();

    res.json({
      message: `Listing ${listing.featured ? "featured" : "unfeatured"}`,
      featured: listing.featured,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to update listing" });
  }
};

/* ================= ADMIN: GET STATS ================= */
export const getAdminStats = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }

    const totalListings = await Listing.countDocuments();
    const verifiedListings = await Listing.countDocuments({ verified: true });
    const featuredListings = await Listing.countDocuments({ featured: true });

    res.json({
      totalListings,
      verifiedListings,
      featuredListings,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch stats" });
  }
};