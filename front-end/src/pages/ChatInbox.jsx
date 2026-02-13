import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { FiCheck, FiTrash2, FiCheckSquare, FiSquare } from "react-icons/fi";
import socket from "../socket/socket";

export default function ChatInbox() {
  const [chats, setChats] = useState([]);
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState([]);

  // ✅ Prevent duplicate fetches
  const isFetchingRef = useRef(false);
  const lastFetchTimeRef = useRef(0);

  const currentUserId = JSON.parse(localStorage.getItem("user"))?._id;

  /* ================= FETCH CHATS WITH DEDUPLICATION ================= */
  const fetchChats = async () => {
    // ✅ Prevent multiple simultaneous fetches
    if (isFetchingRef.current) {
      console.log("⏳ Already fetching, skipping...");
      return;
    }

    // ✅ Debounce: Don't fetch more than once per 500ms
    const now = Date.now();
    if (now - lastFetchTimeRef.current < 500) {
      console.log("⏳ Too soon, debouncing...");
      return;
    }

    isFetchingRef.current = true;
    lastFetchTimeRef.current = now;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/chats/my-chats`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();

      // ✅ Deduplicate by chat ID
      const uniqueChats = Array.isArray(data)
        ? data.filter((chat, index, self) =>
          index === self.findIndex(c => c._id === chat._id)
        )
        : [];

      setChats(uniqueChats);
      console.log("📊 Chats updated:", uniqueChats.length);
    } catch (err) {
      console.error("Failed to fetch chats:", err);
      setChats([]);
    } finally {
      isFetchingRef.current = false;
    }
  };

  /* ================= INITIAL LOAD ================= */
  useEffect(() => {
    if (!currentUserId) return;

    fetchChats();

    if (!socket.connected) socket.connect();
    socket.emit("registerUser", currentUserId);
  }, [currentUserId]);

  /* ================= REALTIME UPDATE - DEBOUNCED ================= */
  useEffect(() => {
    if (!currentUserId) return;

    // ✅ Debounced refresh function
    let refreshTimeout;
    const debouncedRefresh = () => {
      clearTimeout(refreshTimeout);
      refreshTimeout = setTimeout(() => {
        fetchChats();
      }, 300); // Wait 300ms after last event
    };

    const onNewNotification = (data) => {
      console.log("🔔 [INBOX] New notification:", data);
      debouncedRefresh();
    };

    const onChatUpdated = (data) => {
      console.log("💬 [INBOX] Chat updated:", data);
      debouncedRefresh();
    };

    const onReceiveMessage = (msg) => {
      console.log("📩 [INBOX] Message received:", msg);
      if (msg.sender !== currentUserId) {
        debouncedRefresh();
      }
    };

    socket.on("newNotification", onNewNotification);
    socket.on("chatUpdated", onChatUpdated);
    socket.on("receiveMessage", onReceiveMessage);

    return () => {
      clearTimeout(refreshTimeout);
      socket.off("newNotification", onNewNotification);
      socket.off("chatUpdated", onChatUpdated);
      socket.off("receiveMessage", onReceiveMessage);
    };
  }, [currentUserId]);

  /* ================= DELETE SINGLE CHAT ================= */
  const deleteChat = async (chatId, e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm("Delete this conversation?")) return;

    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/chats/${chatId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setChats((prev) => prev.filter((c) => c._id !== chatId));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  /* ================= DELETE SELECTED ================= */
  const deleteSelected = async () => {
    if (selected.length === 0) return;
    if (!confirm(`Delete ${selected.length} conversation(s)?`)) return;

    try {
      await Promise.all(
        selected.map((id) =>
          fetch(`${import.meta.env.VITE_API_URL}/api/chats/${id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
        )
      );

      setChats((prev) => prev.filter((c) => !selected.includes(c._id)));
      setSelected([]);
      setSelectMode(false);
    } catch (err) {
      console.error("Bulk delete failed:", err);
    }
  };

  /* ================= TOGGLE SELECT ================= */
  const toggleSelect = (chatId, e) => {
    e.preventDefault();
    e.stopPropagation();

    setSelected((prev) =>
      prev.includes(chatId)
        ? prev.filter((id) => id !== chatId)
        : [...prev, chatId]
    );
  };

  /* ================= SELECT ALL ================= */
  const toggleSelectAll = () => {
    if (selected.length === chats.length) {
      setSelected([]);
    } else {
      setSelected(chats.map((c) => c._id));
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A] transition-colors">
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-8 pt-24 sm:pt-28">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-[20px] sm:text-[24px] font-semibold text-black dark:text-white">
            Messages
          </h1>

          {chats.length > 0 && (
            <div className="flex items-center gap-2">
              {selectMode ? (
                <>
                  <button
                    onClick={toggleSelectAll}
                    className="text-sm text-blue-600 dark:text-blue-400"
                  >
                    {selected.length === chats.length
                      ? "Deselect All"
                      : "Select All"}
                  </button>
                  <button
                    onClick={deleteSelected}
                    disabled={selected.length === 0}
                    className="px-3 py-1.5 bg-red-500 text-white rounded-md text-sm disabled:opacity-50"
                  >
                    Delete ({selected.length})
                  </button>
                  <button
                    onClick={() => {
                      setSelectMode(false);
                      setSelected([]);
                    }}
                    className="text-sm text-gray-600 dark:text-gray-400"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setSelectMode(true)}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                >
                  Select
                </button>
              )}
            </div>
          )}
        </div>

        {/* CHAT LIST */}
        <div className="bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-neutral-700 rounded-lg divide-y divide-gray-200 dark:divide-neutral-700">
          {chats.length === 0 && (
            <p className="p-6 text-center text-gray-500">
              No conversations yet
            </p>
          )}

          {chats.map((chat) => {
            const formatTime = (date) =>
              date
                ? new Date(date).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
                : "";

            const otherUser = chat.participants.find(
              (u) => u._id !== currentUserId
            );

            if (!otherUser) return null;

            const isReceiver =
              chat.lastMessageSender &&
              chat.lastMessageSender !== currentUserId;

            const isSelected = selected.includes(chat._id);

            return (
              <Link
                key={chat._id}
                to={selectMode ? "#" : `/chat/${otherUser._id}`}
                onClick={(e) => {
                  if (selectMode) {
                    toggleSelect(chat._id, e);
                  }
                }}
                className="flex items-center px-4 py-3 hover:bg-gray-100 dark:hover:bg-neutral-800 transition relative"
              >
                {/* SELECT CHECKBOX */}
                {selectMode && (
                  <div className="mr-3">
                    {isSelected ? (
                      <FiCheckSquare
                        size={20}
                        className="text-blue-600 dark:text-blue-400"
                      />
                    ) : (
                      <FiSquare
                        size={20}
                        className="text-gray-400 dark:text-gray-600"
                      />
                    )}
                  </div>
                )}

                {/* AVATAR */}
                <img
                  src={otherUser.avatar}
                  className="w-12 h-12 rounded-full object-cover"
                  alt={otherUser.name}
                />

                {/* CONTENT */}
                <div className="flex-1 ml-4 min-w-0">
                  {/* TOP */}
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-[15px] text-black dark:text-white truncate">
                      {otherUser.name}
                    </p>

                    <span className="text-[11px] text-gray-400 whitespace-nowrap ml-2">
                      {formatTime(chat.lastMessageAt)}
                    </span>
                  </div>

                  {/* BOTTOM */}
                  <div className="flex items-center justify-between mt-0.5">
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate flex items-center gap-1">
                      {chat.lastMessageSender === currentUserId && (
                        <span className="flex items-center mr-1 text-gray-500">
                          <FiCheck size={13} />
                          {chat.unreadCount === 0 && (
                            <FiCheck size={13} className="-ml-2" />
                          )}
                        </span>
                      )}
                      {chat.lastMessage}
                    </p>

                    {isReceiver && chat.unreadCount > 0 && (
                      <span className="ml-3 min-w-[20px] h-[20px] px-1.5 text-[11px] bg-green-500 text-white rounded-full flex items-center justify-center font-medium">
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>
                </div>

                {/* DELETE BUTTON */}
                {!selectMode && (
                  <button
                    onClick={(e) => deleteChat(chat._id, e)}
                    className="ml-3 p-2 text-gray-400 hover:text-red-500 transition"
                  >
                    <FiTrash2 size={16} />
                  </button>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}