import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import CbtSession from "@/lib/models/CbtSession";
import CbtAnswer from "@/lib/models/CbtAnswer";
import Question from "@/lib/models/Question";
import { protect } from "@/lib/auth";

export async function GET(req, { params }) {
  try {
    await protect(req);
    await dbConnect();
    const { sessionId } = await params;

    // 1. Get Session
    // Since sessionId is a slug, we find by sessionId field, NOT _id
    const session = await CbtSession.findOne({ sessionId });
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    if (session.status !== "submitted") {
      return NextResponse.json(
        { error: "Session not submitted yet" },
        { status: 400 }
      );
    }

    // 2. Get User Answers
    const answers = await CbtAnswer.find({ sessionId });
    const answerMap = {};
    answers.forEach((a) => {
      answerMap[a.questionId] = a.selectedOption;
    });

    // 3. Get Questions (Re-fetch to get correct answers and explanations)
    // We need to know which questions were in the session.
    // Ideally CbtSession stores the question IDs.
    // If not, we might have to fetch by subject/year again or rely on what we have.
    // Assuming we can fetch by subject/year from session slug or metadata.

    // Parse slug: subject-year-topic
    const parts = sessionId.split("-");
    const subject = parts[0];
    const year = parts[1];

    // Fetch questions
    // Note: In a real app, we should store the specific Question IDs in the Session to ensure exact match.
    // For now, we query by subject/year.
    const questions = await Question.find({
      subject: { $regex: new RegExp(subject, "i") },
      year: parseInt(year),
    }).lean();

    // 4. Merge Data
    const reviewQuestions = questions.map((q, index) => ({
      qid: q._id.toString(),
      index: index,
      questionText: q.question,
      options: q.options,
      correctAnswer: q.answer,
      userAnswer: answerMap[q._id.toString()] || null,
      tutorExplanation: q.explanation || "No explanation provided.",
      aiExplanation: null, // Placeholder, frontend will fetch if needed
    }));

    return NextResponse.json({
      sessionId,
      questions: reviewQuestions,
    });
  } catch (error) {
    console.error("Review fetch error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
