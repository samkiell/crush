import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import CbtSession from "@/lib/models/CbtSession";
import { protect } from "@/lib/auth";

export async function GET(req, { params }) {
  try {
    await protect(req);
    await dbConnect();
    const { sessionId } = await params;

    const session = await CbtSession.findById(sessionId);
    if (!session)
      return NextResponse.json({ error: "Session not found" }, { status: 404 });

    return NextResponse.json({
      status: session.status,
      startTime: session.startTime,
      endTime: session.endTime,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
