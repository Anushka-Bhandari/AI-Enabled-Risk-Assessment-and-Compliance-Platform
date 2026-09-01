import { io } from "socket.io-client";

const socket = io("http://127.0.0.1:5000", {
  transports: ["websocket", "polling"],
});

socket.on("connect", () => {
  console.log("✅ Connected", socket.id);
});

socket.on("connect_error", (err) => {
  console.log("❌ Connect Error:", err.message);
});

socket.on("disconnect", (reason) => {
  console.log("⚠️ Disconnected:", reason);
});

export default socket;