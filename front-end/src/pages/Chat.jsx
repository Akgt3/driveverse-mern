import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { FiSend, FiArrowLeft, FiCheck, FiImage, FiX } from "react-icons/fi";
import socket from "../socket/socket";

export default function Chat() {
  const { sellerId } = useParams();

  const getDayLabel = (date) => {
    const d = new Date(date);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (d.toDateString() === today.toDateString()) return "Today";
    if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
    return d.toLocaleDateString("en-US", { weekday: "long" });
  };

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const currentUserId = currentUser?._id;

  const containerRef = useRef(null);
  const bottomRef = useRef(null);
  const isAtBottomRef = useRef(true);
  const firstLoadRef = useRef(true);
  const fileInputRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [chatId, setChatId] = useState(null);
  const [seller, setSeller] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  /* ================= SOCKET CONNECTION ================= */
  useEffect(() => {
    if (!socket.connected) socket.connect();

    return () => {
      socket.off("receiveMessage");
      socket.off("messageSeen");
    };
  }, []);

  /* ================= CREATE/GET CHAT ================= */
  useEffect(() => {
    const createChat = async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/chats/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ sellerId }),
      });

      const data = await res.json();
      setChatId(data._id);
    };

    createChat();
  }, [sellerId]);

  /* ================= LOAD MESSAGES ================= */
  useEffect(() => {
    if (!chatId) return;

    const loadMessages = async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/messages/${chatId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await res.json();

      setMessages(
        data.map((m) => ({
          ...m,
          from: m.sender === currentUserId ? "user" : "seller",
          time: new Date(m.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        }))
      );

      // ✅ INSTANT SCROLL ON LOAD
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "auto" });
        firstLoadRef.current = false;
      }, 0);

      // Mark as read immediately
      await fetch(`${import.meta.env.VITE_API_URL}/api/chats/read/${chatId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    };

    loadMessages();
    socket.emit("joinChat", chatId);
  }, [chatId, currentUserId]);

  /* ================= SOCKET RECEIVE MESSAGE ================= */
  useEffect(() => {
    if (!chatId) return;

    const onReceive = (msg) => {
      if (msg.sender === currentUserId) return;

      // ✅ OPTIMISTIC UPDATE - ADD INSTANTLY
      setMessages((prev) => [
        ...prev,
        {
          ...msg,
          from: "seller",
          time: new Date(msg.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);

      // ✅ MARK AS READ INSTANTLY
      fetch(`${import.meta.env.VITE_API_URL}/api/chats/read/${chatId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }).then(() => {
        socket.emit("markSeen", { chatId, messageId: msg._id });
      });
    };

    socket.on("receiveMessage", onReceive);
    return () => socket.off("receiveMessage", onReceive);
  }, [chatId, currentUserId]);

  /* ================= SOCKET MESSAGE SEEN ================= */
  useEffect(() => {
    if (!chatId) return;

    const onSeen = ({ messageId }) => {
      setMessages((prev) =>
        prev.map((m) => (m._id === messageId ? { ...m, seen: true } : m))
      );
    };

    socket.on("messageSeen", onSeen);
    return () => socket.off("messageSeen", onSeen);
  }, [chatId]);

  /* ================= SCROLL TRACKING ================= */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onScroll = () => {
      isAtBottomRef.current =
        el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    };

    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    if (firstLoadRef.current) return;

    if (isAtBottomRef.current) {
      // ✅ USE RAF FOR SMOOTH SCROLL
      requestAnimationFrame(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      });
    }
  }, [messages]);

  /* ================= SEND TEXT MESSAGE ================= */
  const sendMessage = useCallback(async () => {
    if (!message.trim() || !chatId) return;

    const tempId = `temp-${Date.now()}`;
    const temp = {
      _id: tempId,
      from: "user",
      content: message,
      text: message,
      type: "text",
      createdAt: new Date().toISOString(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      seen: false,
    };

    // ✅ OPTIMISTIC UPDATE - ADD INSTANTLY
    setMessages((prev) => [...prev, temp]);
    setMessage("");

    // ✅ SEND TO BACKEND
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        chatId,
        content: temp.content,
        type: "text",
      }),
    });

    const saved = await res.json();

    // Replace temp message with real one
    setMessages((prev) =>
      prev.map((m) => (m._id === tempId ? { ...m, _id: saved._id } : m))
    );

    socket.emit("sendMessage", {
      ...saved,
      chatId,
      sender: currentUserId,
      receiverId: sellerId,
    });
  }, [message, chatId, currentUserId, sellerId]);

  /* ================= HANDLE IMAGE SELECTION ================= */
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage({
        file,
        preview: reader.result,
      });
    };
    reader.readAsDataURL(file);
  };

  /* ================= SEND IMAGE ================= */
  const sendImage = async () => {
    if (!previewImage || !chatId) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("image", previewImage.file);
    formData.append("chatId", chatId);
    formData.append("type", "image");

    const tempId = `temp-${Date.now()}`;
    const temp = {
      _id: tempId,
      from: "user",
      content: previewImage.preview,
      type: "image",
      createdAt: new Date().toISOString(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      seen: false,
    };

    // ✅ OPTIMISTIC UPDATE
    setMessages((prev) => [...prev, temp]);
    setPreviewImage(null);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/messages/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const saved = await res.json();

      // Replace temp with real image URL
      setMessages((prev) =>
        prev.map((m) =>
          m._id === tempId
            ? {
              ...m,
              _id: saved._id,
              content: saved.content,
            }
            : m
        )
      );

      socket.emit("sendMessage", {
        ...saved,
        chatId,
        sender: currentUserId,
        receiverId: sellerId,
      });
    } catch (err) {
      console.error("Image upload failed:", err);
      // Remove failed message
      setMessages((prev) => prev.filter((m) => m._id !== tempId));
    } finally {
      setUploading(false);
    }
  };

  /* ================= FETCH SELLER ================= */
  useEffect(() => {
    const fetchSeller = async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/profile/${sellerId}`
      );
      setSeller(await res.json());
    };
    fetchSeller();
  }, [sellerId]);

  if (!seller) return null;

  return (
    <div className="fixed inset-0 bg-white dark:bg-[#0A0A0A] flex flex-col">
      {/* HEADER */}
      <div className="h-[56px] sm:h-[72px] flex items-center gap-3 sm:gap-4 px-4 sm:px-5 border-b border-gray-200 dark:border-neutral-800 bg-white dark:bg-[#0F0F0F]">
        <Link to="/chat">
          <FiArrowLeft size={18} className="text-black dark:text-white" />
        </Link>

        <img
          src={seller.avatar}
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
          alt={seller.name}
        />

        <div>
          <p className="text-sm sm:text-base font-medium text-black dark:text-white">
            {seller.name}
          </p>
          <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400">
            {seller.location}
          </p>
        </div>
      </div>

      {/* MESSAGES */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto px-4 sm:px-5 py-3 sm:py-4 space-y-3 sm:space-y-4"
      >
        {messages.map((msg, index) => {
          const prev = messages[index - 1];
          const showDate =
            !prev ||
            new Date(prev.createdAt).toDateString() !==
            new Date(msg.createdAt).toDateString();

          return (
            <div key={msg._id || index}>
              {showDate && (
                <div className="flex justify-center my-3">
                  <span className="text-[11px] px-3 py-1 rounded-full bg-gray-200 dark:bg-neutral-700">
                    {getDayLabel(msg.createdAt)}
                  </span>
                </div>
              )}
              <MessageBubble msg={msg} />
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* IMAGE PREVIEW MODAL */}
      {previewImage && (
        <div className="absolute inset-0 bg-black/90 z-50 flex flex-col">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setPreviewImage(null)}
              className="text-white p-2"
            >
              <FiX size={24} />
            </button>
            <button
              onClick={sendImage}
              disabled={uploading}
              className="bg-green-500 text-white px-6 py-2 rounded-full font-medium disabled:opacity-50"
            >
              {uploading ? "Sending..." : "Send"}
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center p-4">
            <img
              src={previewImage.preview}
              alt="Preview"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}

      {/* INPUT */}
      <div className="h-[56px] sm:h-[72px] px-3 sm:px-4 border-t border-gray-200 dark:border-neutral-800 flex items-center gap-2 sm:gap-3 bg-white dark:bg-[#141414]">
        {/* IMAGE BUTTON */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="text-gray-600 dark:text-gray-300"
        >
          <FiImage size={20} />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageSelect}
        />

        {/* INPUT */}
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 h-[36px] sm:h-[42px] px-3 sm:px-4 rounded-full border border-gray-300 dark:border-neutral-700 bg-white dark:bg-[#1a1a1a] text-sm sm:text-base text-black dark:text-white outline-none"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        {/* SEND */}
        <button
          onClick={sendMessage}
          className="flex items-center justify-center text-black dark:text-white"
        >
          <FiSend size={18} />
        </button>
      </div>
    </div>
  );
}

/* MESSAGE BUBBLE */
function MessageBubble({ msg }) {
  const isUser = msg.from === "user";

  if (msg.type === "image") {
    return (
      <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
        <div
          className={`max-w-[60%] rounded-2xl overflow-hidden ${isUser ? "rounded-br-md" : "rounded-bl-md"
            }`}
        >
          <img
            src={
              msg.content.startsWith("data:")
                ? msg.content
                : msg.content.startsWith("https://")  // ✅ CORRECT
                  ? msg.content
                  : msg.content.startsWith("http://")
                    ? msg.content.replace('http://', 'https://')
                    : `${import.meta.env.VITE_API_URL}${msg.content}`
            }
            alt="Sent image"
            className="w-full h-auto"
          />
          <div
            className={`px-3 py-1 text-[10px] flex items-center justify-end gap-1 ${isUser
              ? "bg-black text-white dark:bg-white dark:text-black"
              : "bg-gray-100 dark:bg-neutral-800"
              }`}
          >
            <span className="opacity-60">{msg.time}</span>
            {isUser && (
              <span className="flex items-center opacity-60">
                <FiCheck size={11} />
                {msg.seen && <FiCheck size={11} className="-ml-2" />}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[78%] px-3 sm:px-4 py-2 rounded-2xl text-[13px] sm:text-sm ${isUser
          ? "bg-black text-white dark:bg-white dark:text-black rounded-br-md"
          : "bg-gray-100 dark:bg-neutral-800 text-black dark:text-white rounded-bl-md"
          }`}
      >
        <p>{msg.text || msg.content}</p>
        <div className="flex items-center justify-end gap-1 mt-1 text-[10px] opacity-60">
          <span>{msg.time}</span>
          {isUser && (
            <span className="flex items-center">
              <FiCheck size={11} />
              {msg.seen && <FiCheck size={11} className="-ml-2" />}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}