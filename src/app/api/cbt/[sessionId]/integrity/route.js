import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import IntegrityLog from "@/lib/models/IntegrityLog";
import CbtSession from "@/lib/models/CbtSession";
import { getIO } from "@/lib/socket"; // Assuming socket instance is exported

export async function POST(request, { params }) {
  try {
    await dbConnect();
    const { sessionId } = await params;
    const body = await request.json();
    const { eventType, details } = body;

    // 1. Log the integrity event
    await IntegrityLog.create({
      sessionId,
      eventType,
      details,
      severity: eventType === "visibilitychange" ? "medium" : "low",
    });

    // 2. Update Session Integrity Count
    const session = await CbtSession.findOne({ sessionId });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    if (session.status === "locked") {
      return NextResponse.json({ locked: true, reason: session.lockReason });
    }

    // Increment warnings for specific events
    if (["visibilitychange", "blur", "resize"].includes(eventType)) {
      session.integrityCount = (session.integrityCount || 0) + 1;
    }

    let locked = false;
    let lockReason = null;

    // 3. Check Thresholds (3 warnings -> Lock)
    if (session.integrityCount >= 3) {
      session.status = "locked";
      session.lockReason =
        "Locked: Multiple integrity violations detected. Why are you cheating?? dont chaet if you want to get above 300 in ur jamb";
      locked = true;
      lockReason = session.lockReason;

      // Emit Socket Event
      try {
        const io = getIO();
        if (io) {
          io.to(sessionId).emit("sessionLocked", { reason: lockReason });
        }
      } catch (e) {
        console.error("Socket emit failed", e);
      }
    }

    await session.save();

    return NextResponse.json({
      success: true,
      locked,
      lockReason,
      warnings: session.integrityCount,
    });
  } catch (error) {
    console.error("Integrity Log Error:", error);
    return NextResponse.json(
      { error: "Error logging integrity" },
      { status: 500 }
    );
  }
}
