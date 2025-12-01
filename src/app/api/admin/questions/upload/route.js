import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Question from '@/lib/models/Question';
import { isAdmin } from '@/lib/adminAuth';

export async function POST(req) {
  try {
    // 1. Admin Authentication
    if (!isAdmin(req)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const body = await req.json();
    const { subject, year, questions } = body;

    // 2. Validation
    if (!subject || !year || !questions || !Array.isArray(questions)) {
      return NextResponse.json(
        { message: 'Invalid payload. subject, year, and questions array are required.' },
        { status: 400 }
      );
    }

    // Validate each question structure
    for (const q of questions) {
      if (!q.qid || !q.question || !q.options || !q.answer) {
        return NextResponse.json(
          { message: `Invalid question format for QID: ${q.qid || 'unknown'}` },
          { status: 400 }
        );
      }
      if (!q.options.A || !q.options.B || !q.options.C || !q.options.D) {
        return NextResponse.json(
          { message: `Missing options for QID: ${q.qid}` },
          { status: 400 }
        );
      }
    }

    // 3. Delete existing questions
    await Question.deleteMany({ subject: subject.toLowerCase(), year });

    // 4. Prepare and Insert new questions
    const questionsToInsert = questions.map((q) => ({
      subject: subject.toLowerCase(),
      year,
      qid: q.qid,
      question: q.question,
      options: q.options,
      answer: q.answer.toUpperCase(),
      explanation: q.explanation || '',
    }));

    await Question.insertMany(questionsToInsert);

    return NextResponse.json({ message: 'Questions uploaded successfully' }, { status: 200 });
  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
