import { NextResponse } from 'next/server';
import { protect } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Question from '@/lib/models/Question';

export async function GET(req) {
  try {
    await protect(req);
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const subject = searchParams.get('subject');
    const year = searchParams.get('year');
    const examType = searchParams.get('examType');
    const limit = parseInt(searchParams.get('limit')) || 10;
    const page = parseInt(searchParams.get('page')) || 1;

    const query = {};
    if (subject) query.subject = subject;
    if (year) query.year = year;
    if (examType) query.examType = examType;

    const questions = await Question.find(query)
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await Question.countDocuments(query);

    return NextResponse.json({
      questions,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 401 });
  }
}

export async function POST(req) {
  try {
    const user = await protect(req);
    if (user.role !== 'admin') {
      return NextResponse.json({ message: 'Not authorized as admin' }, { status: 403 });
    }

    await dbConnect();
    const data = await req.json();

    const question = await Question.create(data);

    return NextResponse.json(question, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
