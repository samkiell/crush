import CbtAnswer from "../models/CbtAnswer.js";
import CbtSession from "../models/CbtSession.js";
import Question from "../models/Question.js";

export const processAnswers = async (sessionId, answers) => {
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
  const count = await CbtAnswer.countDocuments({ sessionId });
  await CbtSession.findByIdAndUpdate(sessionId, { answeredCount: count });

  return results;
};

export const calculateScore = async (sessionId) => {
  const correctCount = await CbtAnswer.countDocuments({
    sessionId,
    isCorrect: true,
  });
  const totalQuestions = await CbtSession.findById(sessionId).select(
    "totalQuestions"
  );

  // Simple score calculation (can be adjusted)
  const score = (correctCount / totalQuestions.totalQuestions) * 100; // Percentage or raw?

  await CbtSession.findByIdAndUpdate(sessionId, { score, status: "submitted" });
  return { correctCount, score };
};
