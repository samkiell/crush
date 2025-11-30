import { NextResponse } from 'next/server';
import { protect } from '@/lib/auth';
import dbConnect from '@/lib/db';

export async function PUT(req) {
  try {
    const user = await protect(req);
    const { theme, notifications, language, examType } = await req.json();

    await dbConnect();

    if (theme) user.preferences.theme = theme;
    if (notifications) user.preferences.notifications = { ...user.preferences.notifications, ...notifications };
    if (language) user.preferences.language = language;
    if (examType) user.examType = examType;

    await user.save();

    return NextResponse.json({
      message: 'Preferences updated',
      preferences: user.preferences,
      examType: user.examType,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
