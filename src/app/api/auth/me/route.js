import { NextResponse } from 'next/server';
import { protect } from '@/lib/auth';

export async function GET(req) {
  try {
    const user = await protect(req);

    return NextResponse.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || 'Not authorized' },
      { status: 401 }
    );
  }
}
