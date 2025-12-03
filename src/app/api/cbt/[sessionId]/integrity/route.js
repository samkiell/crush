import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import IntegrityLog from "@/lib/models/IntegrityLog";

export async function POST(request, { params }) {
  try {
    await dbConnect();
    const { sessionId } = await params;
    const body = await request.json();

    await IntegrityLog.create({
      sessionId,
      ...body,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Integrity Log Error:", error);
    return NextResponse.json(
      { error: "Error logging integrity" },
      { status: 500 }
    );
  }
}
