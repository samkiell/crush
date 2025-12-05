import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ChatMessage from "@/models/ChatMessage";
import ChatRoom from "@/models/ChatRoom";
import User from "@/lib/models/User"; // Import User model
import jwt from "jsonwebtoken";

// Helper to verify JWT
const verifyToken = (request) => {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// GET - Fetch messages for a room
export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get("roomId");
    const limit = parseInt(searchParams.get("limit") || "50");
    const before = searchParams.get("before"); // For pagination

    if (!roomId) {
      return NextResponse.json(
        { success: false, error: "Room ID is required" },
        { status: 400 }
      );
    }

    let query = {
      room: roomId,
      isDeleted: false,
    };

    if (before) {
      query.createdAt = { $lt: new Date(before) };
    }

    const messages = await ChatMessage.find(query)
      .populate("sender", "name avatar")
      .populate("replyTo", "content sender")
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    // Reverse to show oldest first
    messages.reverse();

    return NextResponse.json({
      success: true,
      data: messages,
      hasMore: messages.length === limit,
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

// POST - Send a new message
// POST - Send a new message
export async function POST(request) {
  try {
    console.log("[API] POST /api/chat/messages - Start");
    await dbConnect();
    console.log("[API] DB Connected");

    // Verify authentication
    const decoded = verifyToken(request);
    if (!decoded) {
      console.log("[API] Auth failed: No token or invalid");
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    console.log("[API] User ID from token:", decoded.id);

    const user = await User.findById(decoded.id).select("name avatar");
    if (!user) {
      console.log("[API] User not found in DB");
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { roomId, content, type, mediaUrl, replyTo } = body;
    console.log("[API] Request body:", { roomId, content, type });

    // Validate required fields
    if (!roomId || !content) {
      return NextResponse.json(
        { success: false, message: "Room ID and content are required" },
        { status: 400 }
      );
    }

    // Check if user is a member of the room
    const room = await ChatRoom.findById(roomId);

    if (!room) {
      console.log("[API] Room not found:", roomId);
      return NextResponse.json(
        { success: false, message: "Chat room not found" },
        { status: 404 }
      );
    }

    // Defensive check for members
    const isMember = room.members
      .filter((m) => m)
      .some((memberId) => memberId.toString() === user._id.toString());

    if (!isMember) {
      console.log("[API] User is not a member of the room");
      return NextResponse.json(
        { success: false, message: "You must be a member to send messages" },
        { status: 403 }
      );
    }

    // Create message
    console.log("[API] Creating message...");
    const newMessage = await ChatMessage.create({
      room: roomId,
      sender: user._id,
      content,
      type: type || "text",
      mediaUrl,
      replyTo,
    });
    console.log("[API] Message created:", newMessage._id);

    // Update room's last message
    room.lastMessage = {
      content,
      sender: user._id,
      timestamp: new Date(),
    };
    await room.save();

    const populatedMessage = await ChatMessage.findById(newMessage._id)
      .populate("sender", "name avatar")
      .populate("replyTo", "content sender")
      .lean();

    // Emit socket event
    if (global.io) {
      console.log("[API] Emitting socket event to room:", roomId);
      global.io.to(roomId).emit("message:new", populatedMessage);
    } else {
      console.warn(
        "[API] Socket.io not initialized, message not emitted via socket"
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: populatedMessage,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[API] Error sending message:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send message: " + error.message },
      { status: 500 }
    );
  }
}
