import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_SOCKET_URL, {
  transports: ["websocket"],
  autoConnect: false,
});

export default socket;
