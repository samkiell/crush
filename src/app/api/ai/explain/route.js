import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dbConnect from "@/lib/db";
import CbtAnswer from "@/lib/models/CbtAnswer";

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      question,
      questionText,
      options,
      correctAnswer,
      correctOption,
      sessionId,
      qIndex,
      questionIndex,
      userAnswer,
      selectedAnswer,
    } = body;

    // Normalize inputs
    const qText = questionText || question;
    const cAnswer = correctAnswer || correctOption;
    const uAnswer = userAnswer || selectedAnswer;

    if (!qText || !options || !cAnswer) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Initialize AI
    const apiKey = process.env.GEMINI_API_KEY;
    let explanation = "AI explanation unavailable.";

    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `
Your name is Crush Ai.
You are a sharp, lively tutor on Crush, the platform helping students prepare for their JAMB exams.
Speak like a real human who understands students. Keep your explanations tight, clear, and engaging.

Question: "${qText}"
Options: ${JSON.stringify(options)}
Correct Answer: "${cAnswer}"
User Answer: "${uAnswer || "None"}"

Break down why the correct answer makes sense, and if the user missed it, explain the mix-up in a simple way.
Use a natural flow, sometimes sprinkle light Nigerian pidgin to keep things fun.
Keep it short. Keep it real. Keep it helpful.
Make the student feel supported. You can sign off in your own style, for example by saying Crush Ai got you.

        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        explanation = response.text();
      } catch (aiError) {
        console.error("AI Generation Error:", aiError);
        explanation = "Could not generate AI explanation at this time.";
      }
    } else {
      console.warn("GEMINI_API_KEY not found.");
    }

    // Save to DB if sessionId and qIndex are present
    if (sessionId && qIndex !== undefined) {
      await dbConnect();
      await CbtAnswer.findOneAndUpdate(
        { sessionId, qIndex },
        { aiExplanation: explanation },
        { new: true }
      );
    }

    return NextResponse.json({ explanation });
  } catch (error) {
    console.error("AI Explain Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
