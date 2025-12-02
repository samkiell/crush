import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import CbtSession from "@/lib/models/CbtSession";
import { authorizeAdmin } from "@/lib/auth";

export async function POST(req) {
  try {
    await authorizeAdmin(req);
    await dbConnect();

    const body = await req.json();
    const { sessionId } = body;

    const session = await CbtSession.findByIdAndUpdate(
      sessionId,
      { status: "invalidated" },
      { new: true }
    );

    // Emit socket event if possible
    if (global.io) {
      global.io.to(sessionId).emit("sessionKilled", { reason: "Admin action" });
    }

    return NextResponse.json({ success: true, session });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
