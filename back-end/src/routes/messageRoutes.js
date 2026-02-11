import express from "express";
import protect from "../middleware/authMiddleware.js";
import Message from "../models/Message.js";
import Chat from "../models/Chat.js";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";

const router = express.Router();

// ✅ CLOUDINARY CONFIG FOR CHAT IMAGES
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const chatImageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "driveverse/chats",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 800, height: 800, crop: "limit" }],
  },
});

const chatUpload = multer({
  storage: chatImageStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

/* ================= GET MESSAGES ================= */
router.get("/:chatId", protect, async (req, res) => {
  try {
    const messages = await Message.find({ chatId: req.params.chatId }).sort({
      createdAt: 1,
    });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch messages" });
  }
});

/* ================= SEND TEXT MESSAGE ================= */
router.post("/", protect, async (req, res) => {
  try {
    const { chatId, content, type } = req.body;

    const message = await Message.create({
      chatId,
      sender: req.user._id,
      content,
      type: type || "text",
    });

    // Update chat
    const chat = await Chat.findById(chatId);
    if (chat) {
      chat.lastMessage = type === "image" ? "📷 Photo" : content;
      chat.lastMessageSender = req.user._id;
      chat.lastMessageAt = new Date();
      chat.lastMessageType = type || "text";

      // Increment unread count
      chat.unreadCount = (chat.unreadCount || 0) + 1;

      await chat.save();
    }

    res.json(message);
  } catch (err) {
    console.error("Send message error:", err);
    res.status(500).json({ message: "Failed to send message" });
  }
});

/* ================= ✅ UPLOAD IMAGE MESSAGE ================= */
router.post("/upload", protect, chatUpload.single("image"), async (req, res) => {
  try {
    const { chatId } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    // ✅ CLOUDINARY RETURNS FULL URL IN file.path
    const message = await Message.create({
      chatId,
      sender: req.user._id,
      content: req.file.path, // Cloudinary URL
      type: "image",
    });

    // Update chat
    const chat = await Chat.findById(chatId);
    if (chat) {
      chat.lastMessage = "📷 Photo";
      chat.lastMessageSender = req.user._id;
      chat.lastMessageAt = new Date();
      chat.lastMessageType = "image";
      chat.unreadCount = (chat.unreadCount || 0) + 1;
      await chat.save();
    }

    res.json(message);
  } catch (err) {
    console.error("Upload image error:", err);
    res.status(500).json({ message: "Failed to upload image" });
  }
});

export default router;