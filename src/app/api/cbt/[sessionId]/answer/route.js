import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import CbtAnswer from "@/lib/models/CbtAnswer";
import CbtSession from "@/lib/models/CbtSession";
import Question from "@/lib/models/Question";

export async function POST(request, { params }) {
  try {
    await dbConnect();
    const { sessionId } = await params;
    const body = await request.json();
    const { answers } = body;

    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const session = await CbtSession.findOne({ sessionId });
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const qidToIndex = {};
    session.questions.forEach((q) => {
      qidToIndex[q.qid] = q.index;
    });

    const qids = answers.map((a) => a.questionId);
    const questionsDb = await Question.find({ qid: { $in: qids } });
    const questionMap = {};
    questionsDb.forEach((q) => {
      questionMap[q.qid] = q;
    });

    const operations = answers
      .map((ans) => {
        const qIndex = qidToIndex[ans.questionId];
        const question = questionMap[ans.questionId];

        if (qIndex === undefined || !question) return null;

        const isCorrect = question.answer === ans.selectedOption;

        return {
          updateOne: {
            filter: { sessionId, qIndex },
            update: {
              sessionId,
              userId: session.userId,
              qIndex,
              answer: ans.selectedOption,
              correct: isCorrect,
            },
            upsert: true,
          },
        };
      })
      .filter((op) => op !== null);

    if (operations.length > 0) {
      await CbtAnswer.bulkWrite(operations);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Answer Sync Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
