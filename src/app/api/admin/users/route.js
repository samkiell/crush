import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import jwt from "jsonwebtoken";

const getAdminUser = async (req) => {
  let token;

  // Check Authorization header
  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  // Check cookies if no header token
  if (!token) {
    token =
      req.cookies.get("auth_token")?.value || req.cookies.get("token")?.value;
  }

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (user && user.role === "admin") {
      return user;
    }
    return null;
  } catch (error) {
    return null;
  }
};

import CbtSession from "@/lib/models/CbtSession";

export async function GET(req) {
  await dbConnect();
  const admin = await getAdminUser(req);

  if (!admin) {
    return NextResponse.json(
      { success: false, error: "Not authorized as admin" },
      { status: 403 }
    );
  }

  try {
    const users = await User.find()
      .select("-password") // Exclude password
      .sort({ createdAt: -1 })
      .lean(); // Use lean() for better performance and modifiable objects

    // Fetch all active sessions
    const activeSessions = await CbtSession.find({ status: "active" })
      .select("userId sessionId mode")
      .lean();

    // Create a map of userId -> session data
    const sessionMap = activeSessions.reduce((acc, session) => {
      if (session.userId) {
        acc[session.userId.toString()] = {
          sessionId: session.sessionId,
          mode: session.mode || "cbt", // Default to cbt if mode is missing
        };
      }
      return acc;
    }, {});

    // Attach activeSession data to users
    const usersWithSessions = users.map((user) => ({
      ...user,
      activeSession: sessionMap[user._id.toString()] || null,
    }));

    return NextResponse.json({ success: true, users: usersWithSessions });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
