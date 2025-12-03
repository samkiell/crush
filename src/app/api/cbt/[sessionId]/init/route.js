import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import CbtSession from "@/lib/models/CbtSession";
import { protect } from "@/lib/auth";

export async function POST(request, { params }) {
  try {
    const user = await protect(request);
    await dbConnect();
    const { sessionId } = await params;
    const body = await request.json();
    const { questions, subject, year, totalQuestions } = body;

    // Check if session exists
    // Check if session exists for this user
    let session = await CbtSession.findOne({ sessionId, userId: user._id });

    if (session) {
      // Session exists, maybe update last active time?
      return NextResponse.json({
        message: "Session already exists",
        sessionId,
      });
    }

    // Create new session
    // questions should be array of { qid, index }
    const formattedQuestions = questions.map((q, i) => ({
      qid: q.qid,
      index: i, // Ensure index is set
    }));

    const durationMs = 2 * 60 * 60 * 1000; // 2 hours default
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + durationMs);

    session = await CbtSession.create({
      sessionId,
      userId: user._id,
      subject: subject || "Unknown",
      year: year || new Date().getFullYear(),
      questions: formattedQuestions,
      startTime,
      endTime,
      status: "active",
      mode: "cbt",
      summary: {
        totalQuestions: totalQuestions || questions.length,
        correct: 0,
        wrong: 0,
        unanswered: questions.length,
        percentage: 0,
        score: 0,
      },
    });

    return NextResponse.json({
      sessionId: session.sessionId,
      startTime,
      endTime,
    });
  } catch (error) {
    console.error("Init Session Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
