import express from "express";
import protect from "../middleware/authMiddleware.js";
import Chat from "../models/Chat.js";
import Message from "../models/Message.js";

const router = express.Router();

/* ================= GET MY CHATS ================= */
router.get("/my-chats", protect, async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.user._id,
    })
      .populate("participants", "name avatar")
      .sort({ lastMessageAt: -1 });

    res.json(chats);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch chats" });
  }
});

/* ================= CREATE OR GET CHAT ================= */
router.post("/create", protect, async (req, res) => {
  try {
    const { sellerId } = req.body;

    let chat = await Chat.findOne({
      participants: { $all: [req.user._id, sellerId] },
    }).populate("participants", "name avatar");

    if (!chat) {
      chat = await Chat.create({
        participants: [req.user._id, sellerId],
      });

      chat = await Chat.findById(chat._id).populate(
        "participants",
        "name avatar"
      );
    }

    res.json(chat);
  } catch (err) {
    res.status(500).json({ message: "Failed to create chat" });
  }
});

/* ================= ✅ FIXED: GET UNREAD COUNT (NO SPACES) ================= */
router.get("/unread-count", protect, async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.user._id,
    });

    // Sum all unreadCount values
    const totalUnread = chats.reduce(
      (sum, chat) => sum + (chat.unreadCount || 0),
      0
    );

    res.json({ count: totalUnread });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch unread count" });
  }
});

/* ================= MARK AS READ ================= */
router.put("/read/:chatId", protect, async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Mark all messages as seen
    await Message.updateMany(
      {
        chatId: req.params.chatId,
        sender: { $ne: req.user._id },
        seen: false,
      },
      { seen: true }
    );

    // Reset unread count
    chat.unreadCount = 0;
    await chat.save();

    res.json({ message: "Messages marked as read" });
  } catch (err) {
    res.status(500).json({ message: "Failed to mark as read" });
  }
});

/* ================= DELETE CHAT ================= */
router.delete("/:chatId", protect, async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Check authorization
    if (!chat.participants.includes(req.user._id)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Delete all messages
    await Message.deleteMany({ chatId: req.params.chatId });

    // Delete chat
    await chat.deleteOne();

    res.json({ message: "Chat deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete chat" });
  }
});

export default router;