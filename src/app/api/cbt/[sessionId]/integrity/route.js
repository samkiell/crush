import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import IntegrityLog from "@/lib/models/IntegrityLog";
import { protect } from "@/lib/auth";

export async function POST(req, { params }) {
  try {
    await protect(req);
    await dbConnect();
    const { sessionId } = await params;
    const body = await req.json();
    const { eventType, details, severity } = body;

    await IntegrityLog.create({
      sessionId,
      eventType,
      details,
      severity,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
