import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Report from '@/lib/models/Report';
import User from '@/lib/models/User';
import CommunityPost from '@/lib/models/CommunityPost'; // Ensure models are registered
import Comment from '@/lib/models/Comment';
import jwt from 'jsonwebtoken';

const getAdminUser = async (req) => {
  let token;

  // Check Authorization header
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  // Check cookies if no header token
  if (!token) {
    token = req.cookies.get('auth_token')?.value || req.cookies.get('token')?.value;
  }

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
    const reports = await Report.find()
      .sort({ createdAt: -1 })
      .populate('reporter', 'name email')
      .populate('targetId'); // This might be tricky if targetId refs different collections dynamically without proper setup, but Mongoose 'refPath' handles it.

    // Note: populate('targetId') works if refPath is set correctly in Schema.
    // However, if the target document is deleted, it might be null.

    return NextResponse.json({ success: true, data: reports });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
