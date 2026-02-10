import express from "express";
import Message from "../models/Message.js";
import Chat from "../models/Chat.js";
import protect from "../middleware/authMiddleware.js";
import multer from "multer";
import path from "path";

const router = express.Router();

// ✅ MULTER CONFIG FOR IMAGE UPLOAD
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/chat-images");
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);

    if (ext && mime) {
      cb(null, true);
    } else {
      cb(new Error("Only images allowed"));
    }
  },
});

/* ================= GET MESSAGES ================= */
router.get("/:chatId", protect, async (req, res) => {
  const messages = await Message.find({
    chatId: req.params.chatId,
  }).sort({ createdAt: 1 });

  res.json(messages);
});

/* ================= SEND TEXT MESSAGE ================= */
router.post("/", protect, async (req, res) => {
  const { chatId, content, type } = req.body;

  if (!chatId || !content) {
    return res.status(400).json({ message: "Missing data" });
  }

  // 1️⃣ Save message
  const message = await Message.create({
    chatId,
    sender: req.user._id,
    content,
    type: type || "text",
  });

  // 2️⃣ Update chat
  const chat = await Chat.findById(chatId);

  if (chat) {
    chat.lastMessage = type === "image" ? "📷 Photo" : content;
    chat.lastMessageSender = req.user._id;
    chat.lastMessageAt = new Date();
    chat.lastMessageSeen = false;
    chat.unreadCount = (chat.unreadCount || 0) + 1;
    await chat.save();
  }

  res.json(message);
});

/* ================= UPLOAD IMAGE MESSAGE ================= */
router.post("/upload", protect, upload.single("image"), async (req, res) => {
  try {
    const { chatId, type } = req.body;

    if (!chatId || !req.file) {
      return res.status(400).json({ message: "Missing data" });
    }

    const imagePath = `/uploads/chat-images/${req.file.filename}`;

    // 1️⃣ Save message
    const message = await Message.create({
      chatId,
      sender: req.user._id,
      content: imagePath,
      type: "image",
    });

    // 2️⃣ Update chat
    const chat = await Chat.findById(chatId);

    if (chat) {
      chat.lastMessage = "📷 Photo";
      chat.lastMessageSender = req.user._id;
      chat.lastMessageAt = new Date();
      chat.lastMessageSeen = false;
      chat.unreadCount = (chat.unreadCount || 0) + 1;
      await chat.save();
    }

    res.json(message);
  } catch (err) {
    console.error("Image upload error:", err);
    res.status(500).json({ message: "Upload failed" });
  }
});

export default router;
