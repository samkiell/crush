import { NextResponse } from 'next/server';
import { protect } from '@/lib/auth';
import dbConnect from '@/lib/db';
import ExamSession from '@/lib/models/ExamSession';

export async function GET(req) {
  try {
    const user = await protect(req);
    await dbConnect();

    // Get recent exam sessions for the user
    const sessions = await ExamSession.find({ user: user._id })
      .sort({ completedAt: -1 })
      .limit(10);

    const progress = sessions.map(session => ({
      date: session.completedAt.toISOString().split('T')[0],
      score: (session.score / session.totalQuestions) * 100,
      examType: session.examType,
    }));

    return NextResponse.json(progress);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 401 });
  }
}
