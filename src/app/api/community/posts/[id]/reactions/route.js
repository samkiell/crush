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
      
      // Decrement count and update author reputation
      let targetAuthorId;
      if (targetType === 'CommunityPost') {
        const post = await CommunityPost.findByIdAndUpdate(id, { $inc: { likes: -1 } });
        targetAuthorId = post.author;
      } else {
        const comment = await Comment.findByIdAndUpdate(id, { $inc: { likes: -1 } });
        targetAuthorId = comment.author;
      }

      // Decrement Reputation
      if (targetAuthorId && targetAuthorId.toString() !== user._id.toString()) {
        await User.findByIdAndUpdate(targetAuthorId, { $inc: { reputation: -5 } });
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

      // Increment count and update author reputation
      let targetAuthorId;
      if (targetType === 'CommunityPost') {
        const post = await CommunityPost.findByIdAndUpdate(id, { $inc: { likes: 1 } });
        targetAuthorId = post.author;
      } else {
        const comment = await Comment.findByIdAndUpdate(id, { $inc: { likes: 1 } });
        targetAuthorId = comment.author;
      }

      // Update Reputation
      if (targetAuthorId && targetAuthorId.toString() !== user._id.toString()) {
        const author = await User.findByIdAndUpdate(targetAuthorId, { $inc: { reputation: 5 } }, { new: true });
        
        // Check for Badges
        const newBadges = [];
        if (author.reputation >= 50 && !author.badges.includes('Rising Star')) newBadges.push('Rising Star');
        if (author.reputation >= 200 && !author.badges.includes('Expert')) newBadges.push('Expert');
        if (author.reputation >= 1000 && !author.badges.includes('Legend')) newBadges.push('Legend');

        if (newBadges.length > 0) {
          await User.findByIdAndUpdate(targetAuthorId, { $push: { badges: { $each: newBadges } } });
        }
      }

      return NextResponse.json({ success: true, action: 'added' });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
