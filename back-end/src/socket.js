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

    // 📤 Send message (INSTANT)
    socket.on("sendMessage", (data) => {
      const { chatId, receiverId, ...messageData } = data;

      if (!chatId || !receiverId) return;

      console.log(`📤 Message sent in chat ${chatId} to user ${receiverId}`);

      // ✅ INSTANT: Send to chat room
      io.to(chatId.toString()).emit("receiveMessage", messageData);

      // ✅ INSTANT: Notify receiver's header
      io.to(receiverId.toString()).emit("newNotification");
    });

    // ✅ Mark message as seen (INSTANT DOUBLE TICK)
    socket.on("markSeen", ({ chatId, messageId }) => {
      if (!chatId || !messageId) return;

      console.log(`✅ Message ${messageId} marked as seen in chat ${chatId}`);

      // Emit to chat room so sender sees double tick instantly
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