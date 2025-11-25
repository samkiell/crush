import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Report from '@/lib/models/Report';
import User from '@/lib/models/User';
import jwt from 'jsonwebtoken';

const getUserFromRequest = async (req) => {
  const token = req.cookies.get('token')?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return await User.findById(decoded.id);
  } catch (error) {
    return null;
  }
};

export async function POST(req) {
  await dbConnect();
  const user = await getUserFromRequest(req);

  if (!user) {
    return NextResponse.json({ success: false, error: 'Not authorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { targetType, targetId, reason, description } = body;

    if (!targetType || !targetId || !reason) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // Check if already reported by this user
    const existingReport = await Report.findOne({
      reporter: user._id,
      targetType,
      targetId,
      status: 'pending'
    });

    if (existingReport) {
        return NextResponse.json({ success: false, error: 'You have already reported this item.' }, { status: 400 });
    }

    const report = await Report.create({
      reporter: user._id,
      targetType,
      targetId,
      reason,
      description,
    });

    return NextResponse.json({ success: true, data: report }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
