import { NextResponse } from "next/server";
import { processAnswers } from "@/lib/cbtService";
import { protect } from "@/lib/auth";

export async function POST(req, { params }) {
  try {
    await protect(req);
    const { sessionId } = await params;
    const body = await req.json();
    const { answers } = body;

    const results = await processAnswers(sessionId, answers);
    return NextResponse.json({ success: true, synced: results.length });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
