import { NextResponse } from 'next/server';
import { protect } from '@/lib/auth';
import dbConnect from '@/lib/db';
import ExamSession from '@/lib/models/ExamSession';
import Question from '@/lib/models/Question';

export async function GET(req) {
  try {
    const user = await protect(req);
    await dbConnect();

    // Calculate stats
    const totalQuestions = await Question.countDocuments(); // Total available questions
    const completedExams = await ExamSession.countDocuments({ user: user._id });
    
    const sessions = await ExamSession.find({ user: user._id });
    let totalScore = 0;
    let totalPossible = 0;

    sessions.forEach(session => {
      totalScore += session.score;
      totalPossible += session.totalQuestions;
    });

    const averageScore = totalPossible > 0 ? Math.round((totalScore / totalPossible) * 100) : 0;

    // Identify weak topics (mock logic for now, can be improved with real topic tracking)
    // In a real app, we would aggregate performance by subject/topic from ExamSession answers
    const weakTopics = []; 
    // Example: Check sessions for low scores in specific subjects
    
    return NextResponse.json({
      stats: {
        totalQuestions,
        completedExams,
        averageScore,
        weakTopics,
      },
      progress: sessions.map(session => ({
        date: session.completedAt.toISOString().split('T')[0],
        score: (session.score / session.totalQuestions) * 100,
      })).slice(0, 7), // Last 7 sessions
    });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 401 });
  }
}
