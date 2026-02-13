import { Server } from "socket.io";

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 Socket connected:", socket.id);

    // 🔐 Register logged-in user
    socket.on("registerUser", (userId) => {
      if (!userId) return;
      socket.join(userId.toString());
      console.log(`✅ User ${userId} joined room ${userId.toString()}`);
    });

    // 💬 Join chat room
    socket.on("joinChat", (chatId) => {
      if (!chatId) return;
      socket.join(chatId.toString());
      console.log(`💬 Joined chat room: ${chatId}`);
    });

    // 📤 Send message (INSTANT - NO DELAYS)
    socket.on("sendMessage", (data) => {
      const { chatId, receiverId, sender, ...messageData } = data;

      if (!chatId || !receiverId || !sender) return;

      console.log(`📤 Message: ${sender} → ${receiverId} in chat ${chatId}`);

      // ✅ SEND TO CHAT ROOM (BOTH SEE INSTANTLY)
      io.to(chatId.toString()).emit("receiveMessage", {
        ...messageData,
        sender,
      });

      // ✅ CRITICAL: Only notify RECEIVER's header (NOT sender's)
      if (receiverId.toString() !== sender.toString()) {
        io.to(receiverId.toString()).emit("newNotification");
        console.log(`📬 Header notification sent to ${receiverId}`);
      } else {
        console.log(`⛔ Skipped self-notification for ${sender}`);
      }

      // ✅ UPDATE CHATINBOX FOR BOTH USERS (INSTANT)
      io.to(sender.toString()).emit("chatListUpdate");
      io.to(receiverId.toString()).emit("chatListUpdate");
    });

    // ✅ Mark message as seen (INSTANT DOUBLE TICK)
    socket.on("markSeen", ({ chatId, messageId, seenBy }) => {
      if (!chatId || !messageId) return;

      console.log(`✅ Message ${messageId} seen by ${seenBy} in chat ${chatId}`);

      // ✅ INSTANT DOUBLE TICK TO CHAT ROOM
      io.to(chatId.toString()).emit("messageSeen", { messageId });
    });

    // 🚫 Account blocked
    socket.on("accountBlocked", (userId) => {
      io.to(userId.toString()).emit("accountBlocked", {
        message: "Your account has been blocked by an administrator",
      });
    });

    socket.on("disconnect", () => {
      console.log("🔴 Socket disconnected:", socket.id);
    });
  });

  return io;
};