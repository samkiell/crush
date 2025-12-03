import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import CbtSession from "@/lib/models/CbtSession";
import { getIO } from "@/lib/socket";

export async function POST(request) {
  try {
    await dbConnect();
    const { sessionId, reason } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID required" },
        { status: 400 }
      );
    }

    const session = await CbtSession.findOne({ sessionId });
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    session.status = "locked";
    session.lockReason = reason || "Admin terminated session.";
    await session.save();

    // Emit Socket Event
    try {
      const io = getIO();
      if (io) {
        io.to(sessionId).emit("sessionLocked", { reason: session.lockReason });
      }
    } catch (e) {
      console.error("Socket emit failed", e);
    }

    return NextResponse.json({ success: true, message: "Session killed." });
  } catch (error) {
    console.error("Admin Kill Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
