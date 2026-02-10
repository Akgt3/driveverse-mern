import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    lastMessage: {
      type: String,
      default: "",
    },

    unreadCount: {
      type: Number,
      default: 0,
    },

    lastMessageSender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    lastMessageAt: {
      type: Date,
    },

    lastMessageSeen: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true } // ✅ this already gives updatedAt
);

export default mongoose.model("Chat", chatSchema);
