import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Report from '@/lib/models/Report';
import User from '@/lib/models/User';
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

export async function PATCH(req, { params }) {
  await dbConnect();
  const admin = await getAdminUser(req);
  const { id } = await params;

  if (!admin) {
    return NextResponse.json({ success: false, error: 'Not authorized as admin' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { status } = body;

    if (!['pending', 'resolved', 'dismissed'].includes(status)) {
        return NextResponse.json({ success: false, error: 'Invalid status' }, { status: 400 });
    }

    const report = await Report.findByIdAndUpdate(id, { status }, { new: true });

    if (!report) {
        return NextResponse.json({ success: false, error: 'Report not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: report });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
