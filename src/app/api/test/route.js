import { NextResponse } from 'next/server';
import User from '@/lib/models/User';
import dbConnect from '@/lib/db';

export async function GET(req) {
  try {
    await dbConnect();
    const count = await User.countDocuments();
    return NextResponse.json({ message: 'User model loaded', count });
  } catch (error) {
    console.error('Test Route Error:', error);
    return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
  }
}
