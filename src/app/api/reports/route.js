import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Report from "@/lib/models/Report";
import Question from "@/lib/models/Question"; // Ensure Question model is registered
import { protect } from "@/lib/auth";

export async function POST(req) {
  try {
    const user = await protect(req);
    await dbConnect();

    const body = await req.json();
    const { targetType, targetId, reason, description, subject, year, qid } =
      body;

    // Validate required fields
    if (!targetType || !targetId || !reason) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create report
    const report = await Report.create({
      reporter: user._id,
      targetType,
      targetId,
      reason,
      description,
      subject,
      year,
      qid,
      status: "pending",
    });

    return NextResponse.json({ success: true, report }, { status: 201 });
  } catch (error) {
    console.error("Report Creation Error:", error);
    return NextResponse.json(
      { error: "Failed to submit report" },
      { status: 500 }
    );
  }
}
