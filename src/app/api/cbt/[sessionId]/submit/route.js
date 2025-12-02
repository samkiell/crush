import { NextResponse } from "next/server";
import { calculateScore } from "@/lib/cbtService";
import { protect } from "@/lib/auth";

export async function POST(req, { params }) {
  try {
    await protect(req);
    const { sessionId } = await params;
    const result = await calculateScore(sessionId);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
