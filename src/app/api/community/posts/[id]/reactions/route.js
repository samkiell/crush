import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Reaction from '@/lib/models/Reaction';
import CommunityPost from '@/lib/models/CommunityPost';
import Comment from '@/lib/models/Comment';
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

export async function POST(req, { params }) {
  await dbConnect();
  const user = await getUserFromRequest(req);
  const { id } = params; // Target ID (Post or Comment)

  if (!user) {
    return NextResponse.json({ success: false, error: 'Not authorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { targetType, type } = body; // targetType: 'CommunityPost' or 'Comment'

    // Check if already reacted
    const existingReaction = await Reaction.findOne({
      user: user._id,
      targetId: id,
      targetType,
      type,
    });

    if (existingReaction) {
      // Toggle off (remove reaction)
      await Reaction.findByIdAndDelete(existingReaction._id);
      
      // Decrement count
      if (targetType === 'CommunityPost') {
        await CommunityPost.findByIdAndUpdate(id, { $inc: { likes: -1 } });
      } else {
        await Comment.findByIdAndUpdate(id, { $inc: { likes: -1 } });
      }

      return NextResponse.json({ success: true, action: 'removed' });
    } else {
      // Add reaction
      await Reaction.create({
        user: user._id,
        targetId: id,
        targetType,
        type,
      });

      // Increment count
      if (targetType === 'CommunityPost') {
        await CommunityPost.findByIdAndUpdate(id, { $inc: { likes: 1 } });
      } else {
        await Comment.findByIdAndUpdate(id, { $inc: { likes: 1 } });
      }

      return NextResponse.json({ success: true, action: 'added' });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
