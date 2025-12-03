import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Question from "@/lib/models/Question";

export async function POST(req) {
  try {
    await dbConnect();
    const { questionIds } = await req.json();

    if (!questionIds || !Array.isArray(questionIds)) {
      return NextResponse.json(
        { message: "Invalid question IDs" },
        { status: 400 }
      );
    }

    const questions = await Question.find({ qid: { $in: questionIds } });

    return NextResponse.json({ questions });
  } catch (error) {
    console.error("Batch Fetch Error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
