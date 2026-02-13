import dotenv from "dotenv";

// ✅ STEP 1: Load .env FIRST (before any other imports that need env vars)
const result = dotenv.config();

if (result.error) {
  console.error("❌ Failed to load .env file:", result.error);
  process.exit(1);
}

console.log("✅ .env file loaded");
console.log("🔍 Cloudinary vars check:");
console.log("   CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME || "❌ MISSING");
console.log("   CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY || "❌ MISSING");
console.log("   CLOUDINARY_API_SECRET:", process.env.CLOUDINARY_API_SECRET ? "✅ Set" : "❌ MISSING");

// ✅ STEP 2: Now import everything else
import express from "express";
import cors from "cors";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import { initSocket } from "./socket.js";
import { configureCloudinary } from "./config/cloudinary.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import listingRoutes from "./routes/listingRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

// ✅ STEP 3: Configure Cloudinary (after dotenv, before routes)
configureCloudinary();

// ✅ STEP 4: Connect to DB
connectDB();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ---------------- MIDDLEWARE ---------------- */
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);
app.use(express.json());

/* ---------------- ROUTES ---------------- */
app.use("/api/reviews", reviewRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);

/* ---------------- STATIC ---------------- */
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/", (req, res) => {
  res.send("🚀 DriveVerse Backend is running");
});

/* ---------------- ERROR HANDLER ---------------- */
app.use((err, req, res, next) => {
  console.error("❌ Unhandled error:", err);

  res.setHeader('Content-Type', 'application/json');
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
});

/* ---------------- SERVER + SOCKET ---------------- */
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
const io = initSocket(server);
app.set("io", io);

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});