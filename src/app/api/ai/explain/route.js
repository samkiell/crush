import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "mock-key");

export async function POST(req) {
  try {
    const { question, options, correctAnswer, selectedAnswer } =
      await req.json();

    if (!process.env.GEMINI_API_KEY) {
      // Mock response if no key
      return NextResponse.json({
        explanation:
          "This is a simulated AI explanation. Please configure GEMINI_API_KEY to get real insights. The correct answer is " +
          correctAnswer +
          " because...",
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      You are an expert tutor helping a student understand a multiple-choice question.
      
      Question: "${question}"
      Options: ${JSON.stringify(options)}
      Correct Answer: ${correctAnswer}
      Student's Answer: ${selectedAnswer || "No answer"}

      Please provide a concise, encouraging, and clear explanation of why the correct answer is correct and why the others might be wrong. 
      Keep it under 150 words. Address the student directly.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ explanation: text });
  } catch (error) {
    console.error("AI Explain error:", error);
    return NextResponse.json(
      {
        explanation:
          "Sorry, I couldn't generate an explanation right now. Please try again later.",
      },
      { status: 500 }
    );
  }
}
