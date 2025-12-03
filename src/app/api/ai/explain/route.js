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
          Your name is Crush Ai
          You are an expert tutor at Crush an educational platform that prepares students for their jamb exams. 
          You are to make your explanation concise and clear.
          Question: "${qText}"
          Options: ${JSON.stringify(options)}
          Correct Answer: "${cAnswer}"
          User Answer: "${uAnswer || "None"}"

          Please provide a concise, clear explanation of why the correct answer is correct, and if the user was wrong, why their answer was incorrect.
          Keep the tone encouraging and educational. some times use nigerian pidgen english to make it fun and you can always add Crush Ai got you or something better, but include your name
          dont make respomse too lenghty, also use natural language and dont use generic tunes
           
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
