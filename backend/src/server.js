import express from "express";
import mongoose from "mongoose";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import cbtRoutes from "./routes/cbt.js";
import adminRoutes from "./routes/admin.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all for now, restrict in production
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

// Inject io into req
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use("/api/cbt", cbtRoutes);
app.use("/api/admin", adminRoutes);

// Socket.io
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinSession", (sessionId) => {
    socket.join(sessionId);
    console.log(`Socket ${socket.id} joined session ${sessionId}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Database Connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/crush")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
