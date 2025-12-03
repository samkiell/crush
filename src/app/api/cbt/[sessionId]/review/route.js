import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import CbtSession from "@/lib/models/CbtSession";
import CbtAnswer from "@/lib/models/CbtAnswer";
import Question from "@/lib/models/Question";

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { sessionId } = await params;

    // 1. Load Session
    const session = await CbtSession.findOne({ sessionId });
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // 2. Validate Status
    if (session.status !== "submitted") {
      return NextResponse.json(
        { error: "Session not submitted yet" },
        { status: 400 }
      );
    }

    // 3. Load Answers
    const answers = await CbtAnswer.find({ sessionId });
    // Create a map for quick lookup: qIndex -> answer
    const answerMap = {};
    answers.forEach((a) => {
      answerMap[a.qIndex] = a;
    });

    // 4. Load Questions
    const questionIds = session.questions.map((q) => q.qid);
    const questionsDb = await Question.find({ qid: { $in: questionIds } });
    const questionDbMap = {};
    questionsDb.forEach((q) => {
      questionDbMap[q.qid] = q;
    });

    // 5. Construct Response
    const reviewQuestions = session.questions
      .map((qItem) => {
        const qDb = questionDbMap[qItem.qid];
        const answer = answerMap[qItem.index];

        if (!qDb) {
          // Should not happen if data is consistent
          return null;
        }

        return {
          qid: qItem.qid,
          index: qItem.index,
          questionText: qDb.question,
          options: qDb.options,
          correctAnswer: qDb.answer,
          userAnswer: answer ? answer.answer : null,
          tutorExplanation: qDb.explanation || null,
          aiExplanation: answer ? answer.aiExplanation : null,
        };
      })
      .filter((q) => q !== null);

    return NextResponse.json({
      sessionId,
      questions: reviewQuestions,
    });
  } catch (error) {
    console.error("Review Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
