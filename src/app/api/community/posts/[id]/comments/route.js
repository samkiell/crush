import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Comment from '@/lib/models/Comment';
import CommunityPost from '@/lib/models/CommunityPost';
import User from '@/lib/models/User';
import jwt from 'jsonwebtoken';
import { filterProfanity } from '@/utils/moderation';

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

export async function GET(req, { params }) {
  await dbConnect();
  const { id } = params; // Post ID

  try {
    const comments = await Comment.find({ post: id })
      .sort({ createdAt: 1 }) // Oldest first for chronological discussion
      .populate('author', 'name avatar badges reputation');

    return NextResponse.json({ success: true, data: comments });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req, { params }) {
  await dbConnect();
  const user = await getUserFromRequest(req);
  const { id } = params; // Post ID

  if (!user) {
    return NextResponse.json({ success: false, error: 'Not authorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { content, parentComment } = body;

    if (!content) {
      return NextResponse.json({ success: false, error: 'Please provide a comment' }, { status: 400 });
    }

    const cleanContent = filterProfanity(content);

    const comment = await Comment.create({
      content: cleanContent,
      post: id,
      author: user._id,
      parentComment: parentComment || null,
    });

    // Update post comment count
    await CommunityPost.findByIdAndUpdate(id, { $inc: { commentsCount: 1 } });

    // Increment reputation
    user.reputation += 2;
    await user.save();

    const populatedComment = await Comment.findById(comment._id).populate('author', 'name avatar badges reputation');

    return NextResponse.json({ success: true, data: populatedComment }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
