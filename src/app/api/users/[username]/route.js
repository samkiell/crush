import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import CommunityPost from '@/lib/models/CommunityPost';
import ExamSession from '@/lib/models/ExamSession';
import { apiHandler } from '@/lib/apiHandler';

export const GET = apiHandler(async (req, { params }) => {
  const { username } = params;

  await dbConnect();

  // 1. Fetch User
  const user = await User.findOne({ username })
    .select('-password -__v')
    .populate({
      path: 'bookmarks',
      select: 'title category createdAt isQuestion isSolved likes commentsCount author tags attachments',
      populate: { path: 'author', select: 'name avatar badges' },
      options: { limit: 5 } // Limit bookmarks for preview
    });

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  // 2. Fetch Stats
  const postsCount = await CommunityPost.countDocuments({ author: user._id });
  
  const examSessions = await ExamSession.find({ user: user._id });
  const examsTaken = examSessions.length;
  
  let averageScore = 0;
  if (examsTaken > 0) {
    const totalScore = examSessions.reduce((acc, session) => acc + session.score, 0);
    averageScore = Math.round(totalScore / examsTaken);
  }

  // Calculate top subjects (mock implementation based on exam type for now)
  // In a real app, we'd aggregate by subject from ExamSession -> Questions
  const topSubjects = [
    { name: 'Mathematics', score: 85 },
    { name: 'English', score: 78 },
    { name: 'Physics', score: 72 }
  ];

  return NextResponse.json({
    success: true,
    data: {
      user,
      stats: {
        postsCount,
        examsTaken,
        averageScore,
        topSubjects
      }
    }
  });
});
