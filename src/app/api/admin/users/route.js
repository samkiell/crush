import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import jwt from 'jsonwebtoken';

const getAdminUser = async (req) => {
  const token = req.cookies.get('token')?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (user && user.role === 'admin') {
        return user;
    }
    return null;
  } catch (error) {
    return null;
  }
};

export async function GET(req) {
  await dbConnect();
  const admin = await getAdminUser(req);

  if (!admin) {
    return NextResponse.json({ success: false, error: 'Not authorized as admin' }, { status: 403 });
  }

  try {
    const users = await User.find()
      .select('-password') // Exclude password
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
