import { Server } from "socket.io";
import dbConnect from "@/lib/db";
import ChatMessage from "@/models/ChatMessage";
import ChatRoom from "@/models/ChatRoom";
import "@/lib/models/User";

export default function handler(req, res) {
  if (res.socket.server.io) {
    console.log("Socket is already running");
    res.end();
    return;
  }

  console.log("Socket is initializing");
  const io = new Server(res.socket.server, {
    path: "/api/socket/io",
    addTrailingSlash: false,
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("room:join", ({ roomId, userId }) => {
      socket.join(roomId);
      console.log(`User ${userId} joined room ${roomId}`);
    });

    socket.on("room:leave", ({ roomId }) => {
      socket.leave(roomId);
      console.log(`User left room ${roomId}`);
    });

    socket.on("message:send", async (messageData) => {
      try {
        // If message is sent via socket, we need to save it to DB first
        // However, if the client uses the POST API, this event might not be used.
        // We implement it just in case the client prefers socket-only flow.
        const { roomId, content, senderId, type, mediaUrl, replyTo } =
          messageData;

        await dbConnect();

        const newMessage = await ChatMessage.create({
          room: roomId,
          sender: senderId,
          content,
          type: type || "text",
          mediaUrl,
          replyTo,
        });

        await ChatRoom.findByIdAndUpdate(roomId, {
          lastMessage: {
            content,
            sender: senderId,
            timestamp: new Date(),
          },
        });

        const populatedMessage = await ChatMessage.findById(newMessage._id)
          .populate("sender", "name avatar")
          .populate("replyTo", "content sender")
          .lean();

        // Broadcast to everyone in the room
        io.to(roomId).emit("message:new", populatedMessage);
      } catch (error) {
        console.error("Error handling message:send:", error);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    socket.on("typing:start", ({ roomId, user }) => {
      socket.to(roomId).emit("typing:start", { roomId, user });
    });

    socket.on("typing:end", ({ roomId, user }) => {
      socket.to(roomId).emit("typing:end", { roomId, user });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  res.socket.server.io = io;
  global.io = io;
  res.end();
}
