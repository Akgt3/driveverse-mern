import express from "express";
import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= CREATE OR GET CHAT ================= */
router.post("/create", protect, async (req, res) => {
  const { sellerId } = req.body;

  let chat = await Chat.findOne({
    participants: { $all: [req.user._id, sellerId] },
  });

  if (!chat) {
    chat = await Chat.create({
      participants: [req.user._id, sellerId],
      unreadCount: 0,
    });
  }

  res.json(chat);
});

/* ================= MY CHATS (INBOX) ================= */
router.get("/my-chats", protect, async (req, res) => {
  const chats = await Chat.find({
    participants: req.user._id,
  })
    .populate("participants", "name avatar")
    .sort({ lastMessageAt: -1 });

  res.json(chats);
});

/* ================= MARK CHAT AS READ ================= */
router.put("/read/:chatId", protect, async (req, res) => {
  const userId = req.user._id;

  // 1️⃣ Mark messages as seen (ONLY messages sent TO this user)
  await Message.updateMany(
    {
      chatId: req.params.chatId,
      sender: { $ne: userId },
      seen: false,
    },
    { $set: { seen: true } }
  );

  // 2️⃣ Reset unread ONLY if last message was NOT sent by this user
  const chat = await Chat.findById(req.params.chatId);

  if (
    chat &&
    chat.lastMessageSender &&
    chat.lastMessageSender.toString() !== userId.toString()
  ) {
    chat.unreadCount = 0;
    chat.lastMessageSeen = true;
    await chat.save();
  }

  res.json({ ok: true });
});

/* ================= HEADER UNREAD COUNT ================= */
router.get("/unread-count", protect, async (req, res) => {
  const count = await Chat.countDocuments({
    participants: req.user._id,
    unreadCount: { $gt: 0 },
    lastMessageSender: { $ne: req.user._id },
  });

  res.json({ count });
});

/* ================= 🗑️ DELETE CHAT ================= */
router.delete("/:chatId", protect, async (req, res) => {
  try {
    const { chatId } = req.params;

    // 1️⃣ Verify user is participant
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const isParticipant = chat.participants.some(
      (p) => p.toString() === req.user._id.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // 2️⃣ Delete all messages in this chat
    await Message.deleteMany({ chatId });

    // 3️⃣ Delete the chat
    await Chat.findByIdAndDelete(chatId);

    res.json({ message: "Chat deleted successfully" });
  } catch (err) {
    console.error("Delete chat error:", err);
    res.status(500).json({ message: "Failed to delete chat" });
  }
});

export default router;