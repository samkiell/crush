import { NextResponse } from 'next/server';
import { protect } from '@/lib/auth';
import dbConnect from '@/lib/db';

export async function PUT(req) {
  try {
    const user = await protect(req);
    const { avatarUrl, publicId } = await req.json();

    if (!avatarUrl) {
      return NextResponse.json({ error: 'Avatar URL is required' }, { status: 400 });
    }

    await dbConnect();

    user.avatar = avatarUrl;
    if (publicId) user.avatarPublicId = publicId;

    await user.save();

    return NextResponse.json({
      message: 'Avatar updated',
      avatar: user.avatar,
    });
  } catch (error) {
    console.error('Avatar Update Error:', error);
    const status = error.message.includes('Not authorized') ? 401 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}
