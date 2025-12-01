import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Question from '@/lib/models/Question';

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const subject = searchParams.get('subject');
    const year = searchParams.get('year');

    if (!subject || !year) {
      return NextResponse.json(
        { message: 'Subject and year are required query parameters' },
        { status: 400 }
      );
    }

    const query = {
      subject: subject.toLowerCase(),
      year: parseInt(year),
    };

    const questions = await Question.find(query).sort({ qid: 1 }); // Sort by QID
    const total = questions.length;

    return NextResponse.json({
      subject,
      year: parseInt(year),
      total,
      questions,
    });
  } catch (error) {
    console.error('Fetch Questions Error:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

