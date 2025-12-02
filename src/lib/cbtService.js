import CbtAnswer from "@/lib/models/CbtAnswer";
import CbtSession from "@/lib/models/CbtSession";
import Question from "@/lib/models/Question";
import dbConnect from "@/lib/db";

export const processAnswers = async (sessionId, answers) => {
  await dbConnect();
  const results = [];

  for (const ans of answers) {
    const question = await Question.findById(ans.questionId);
    if (!question) continue;

    const isCorrect = question.answer === ans.selectedOption;

    const result = await CbtAnswer.findOneAndUpdate(
      { sessionId, questionId: ans.questionId },
      {
        sessionId,
        questionId: ans.questionId,
        selectedOption: ans.selectedOption,
        isCorrect,
        timeSpent: ans.timeSpent,
        syncedAt: new Date(),
      },
      { upsert: true, new: true }
    );
    results.push(result);
  }

  // Update session progress
  if (sessionId.match(/^[0-9a-fA-F]{24}$/)) {
    await CbtSession.findByIdAndUpdate(sessionId, { answeredCount: count });
  }

  return results;
};

export const calculateScore = async (sessionId) => {
  await dbConnect();
  const correctCount = await CbtAnswer.countDocuments({
    sessionId,
    isCorrect: true,
  });
  const session = await CbtSession.findById(sessionId).select("totalQuestions");

  if (!session) throw new Error("Session not found");

  const score = (correctCount / session.totalQuestions) * 100;

  await CbtSession.findByIdAndUpdate(sessionId, { score, status: "submitted" });
  return { correctCount, score, totalQuestions: session.totalQuestions };
};
