import dotenv from "dotenv";
dotenv.config(); // MUST be first

import express from "express";
import cors from "cors";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import { initSocket } from "./socket.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import listingRoutes from "./routes/listingRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
connectDB();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ---------------- MIDDLEWARE ---------------- */
app.use(
  cors({
    origin: "*", // 🔥 IMPORTANT FOR SOCKET
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);
app.use(express.json());
app.use("/api/reviews", reviewRoutes);
/* ---------------- ROUTES ---------------- */
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

/* ---------------- SERVER + SOCKET ---------------- */
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// ✅ INIT SOCKET
const io = initSocket(server);

// ✅ MAKE IO AVAILABLE IN ROUTES
app.set("io", io);

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
