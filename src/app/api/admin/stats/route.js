import { NextResponse } from 'next/server';
import { protect } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import Question from '@/lib/models/Question';
import ExamSession from '@/lib/models/ExamSession';

export async function GET(req) {
  try {
    const user = await protect(req);
    if (user.role !== 'admin') {
      return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
    }

    await dbConnect();

    const now = new Date();
    const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const [totalUsers, totalQuestions, activeNow, dailyExams] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      Question.countDocuments(),
      User.countDocuments({ 'security.lastLogin': { $gte: fifteenMinutesAgo } }),
      ExamSession.countDocuments({ completedAt: { $gte: twentyFourHoursAgo } })
    ]);

    return NextResponse.json({
      totalUsers,
      totalQuestions,
      activeNow,
      dailyExams
    });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
