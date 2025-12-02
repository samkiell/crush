import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import CbtSession from "@/lib/models/CbtSession";
import { protect } from "@/lib/auth";

export async function POST(req) {
  try {
    const user = await protect(req);
    await dbConnect();

    const body = await req.json();
    const { subject, year, mode, totalQuestions } = body;

    const durationMs = 2 * 60 * 60 * 1000; // 2 hours
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + durationMs);

    const session = await CbtSession.create({
      userId: user._id,
      subject,
      year,
      mode,
      totalQuestions,
      startTime,
      endTime,
      status: "active",
    });

    return NextResponse.json({ sessionId: session._id, startTime, endTime });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
