import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import CbtSession from "@/lib/models/CbtSession";
import CbtAnswer from "@/lib/models/CbtAnswer";

import { protect } from "@/lib/auth";

export async function POST(request, { params }) {
  try {
    const user = await protect(request);
    await dbConnect();
    const { sessionId } = await params;

    // 1. Load Session
    // 1. Load Session
    const session = await CbtSession.findOne({ sessionId, userId: user._id });
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // 2. Check status
    if (session.status !== "active") {
      // If already submitted, just return the existing summary
      if (session.status === "submitted" && session.summary) {
        return NextResponse.json({
          sessionId,
          summary: session.summary,
          reviewReady: true,
          message: "Session already submitted",
        });
      }
      return NextResponse.json(
        { error: "Session is not active" },
        { status: 400 }
      );
    }

    // 3. Load Answers
    const answers = await CbtAnswer.find({ sessionId });

    // 4. Compute Stats
    const totalQuestions = session.questions.length;
    const correctCount = answers.filter((a) => a.correct).length;
    const wrongCount = answers.filter((a) => !a.correct).length;
    const answeredCount = answers.length;
    const unansweredCount = totalQuestions - answeredCount;

    // Score calculation (assuming 1 point per question for now, or just correct count)
    // Prompt says "score" and "percentage".
    const score = correctCount; // Raw score
    const percentage =
      totalQuestions > 0
        ? Math.round((correctCount / totalQuestions) * 100)
        : 0;

    const summary = {
      totalQuestions,
      correct: correctCount,
      wrong: wrongCount,
      unanswered: unansweredCount,
      percentage,
      score,
    };

    // 5. Update Session
    session.summary = summary;
    session.status = "submitted";
    session.endTime = new Date();
    await session.save();

    // 6. Return response
    return NextResponse.json({
      sessionId,
      summary,
      reviewReady: true,
    });
  } catch (error) {
    console.error("Submit Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
