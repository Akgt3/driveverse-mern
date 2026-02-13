import { Server } from "socket.io";

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // Track online users
  const onlineUsers = new Map(); // userId -> socketId

  io.on("connection", (socket) => {
    console.log("🟢 Socket connected:", socket.id);

    // 🔐 Register logged-in user
    socket.on("registerUser", (userId) => {
      if (!userId) return;

      // Store user's socket ID
      onlineUsers.set(userId.toString(), socket.id);

      socket.join(userId.toString());
      console.log(`✅ User ${userId} joined room ${userId.toString()}`);
    });

    // 💬 Join chat room
    socket.on("joinChat", (chatId) => {
      if (!chatId) return;
      socket.join(chatId.toString());
      console.log(`💬 Joined chat room: ${chatId}`);
    });

    // 📤 Send message - INSTANT DELIVERY
    socket.on("sendMessage", (data) => {
      const { chatId, receiverId, sender, ...messageData } = data;

      if (!chatId || !receiverId) return;

      console.log(`📤 [${new Date().toISOString()}] Message sent from ${sender} to ${receiverId} in chat ${chatId}`);

      // ✅ INSTANT #1: Broadcast to EVERYONE in chat room (including sender for confirmation)
      io.to(chatId.toString()).emit("receiveMessage", {
        ...messageData,
        chatId,
        sender,
        receiverId,
        _id: messageData._id,
        createdAt: messageData.createdAt || new Date().toISOString(),
      });

      // ✅ INSTANT #2: Send notification to receiver's header (if online)
      const receiverSocketId = onlineUsers.get(receiverId.toString());
      if (receiverSocketId) {
        io.to(receiverId.toString()).emit("newNotification", {
          chatId,
          senderId: sender,
          timestamp: new Date().toISOString(),
        });
        console.log(`🔔 [${new Date().toISOString()}] Notification sent to ${receiverId}`);
      }

      // ✅ INSTANT #3: Update chat inbox for receiver
      io.to(receiverId.toString()).emit("chatUpdated", {
        chatId,
        senderId: sender,
        timestamp: new Date().toISOString(),
      });
    });

    // ✅ Mark message as seen - INSTANT DOUBLE TICK
    socket.on("markSeen", ({ chatId, messageId, senderId }) => {
      if (!chatId || !messageId) return;

      console.log(`👁️ [${new Date().toISOString()}] Message ${messageId} seen in chat ${chatId}`);

      // ✅ INSTANT: Broadcast to ENTIRE chat room
      io.to(chatId.toString()).emit("messageSeen", {
        messageId,
        chatId,
        timestamp: new Date().toISOString(),
      });

      // ✅ INSTANT: Notify original sender directly
      if (senderId) {
        io.to(senderId.toString()).emit("messageSeen", {
          messageId,
          chatId,
          timestamp: new Date().toISOString(),
        });
      }
    });

    // 🚫 Account blocked
    socket.on("accountBlocked", (userId) => {
      io.to(userId.toString()).emit("accountBlocked", {
        message: "Your account has been blocked by an administrator",
      });
    });

    // ✅ User disconnect
    socket.on("disconnect", () => {
      // Remove user from online users map
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          console.log(`🔴 User ${userId} disconnected`);
          break;
        }
      }
      console.log("🔴 Socket disconnected:", socket.id);
    });
  });

  return io;
};