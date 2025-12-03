import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Question from "@/lib/models/Question";
import { authorizeAdmin } from "@/lib/auth";

export async function POST(req) {
  try {
    await authorizeAdmin(req);
    await dbConnect();

    const { questions, replace } = await req.json();

    if (!questions || !Array.isArray(questions)) {
      return NextResponse.json(
        { message: "Invalid data format" },
        { status: 400 }
      );
    }

    // Validate structure (basic check)
    const validQuestions = questions.filter(
      (q) => q.question && q.options && q.answer
    );

    if (validQuestions.length === 0) {
      return NextResponse.json(
        { message: "No valid questions found" },
        { status: 400 }
      );
    }

    if (replace) {
      // If replace is true, we might want to delete based on some criteria (e.g. subject/year of the imported batch)
      // For safety, let's just insert for now unless specific criteria is passed.
      // Or we can delete ALL questions if replace is global (dangerous).
      // Let's assume replace means "upsert" by QID if provided, or just add.

      // Actually, prompt said "Bulk replace question set".
      // Let's assume we replace based on Subject + Year if they are consistent in the batch.
      const subject = validQuestions[0].subject;
      const year = validQuestions[0].year;

      if (subject && year) {
        await Question.deleteMany({ subject, year });
      }
    }

    // Bulk Write
    const operations = validQuestions.map((q) => ({
      insertOne: {
        document: {
          ...q,
          qid:
            q.qid ||
            `${q.subject}-${q.year}-${Math.random().toString(36).substr(2, 9)}`, // Ensure QID
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
    }));

    await Question.bulkWrite(operations);

    return NextResponse.json({
      message: `Imported ${validQuestions.length} questions successfully`,
    });
  } catch (error) {
    console.error("Import Error", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
