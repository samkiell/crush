import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Comment from '@/lib/models/Comment';
import CommunityPost from '@/lib/models/CommunityPost';
import User from '@/lib/models/User';
import jwt from 'jsonwebtoken';

// Helper to get user from token
const getUserFromRequest = async (req) => {
  let token = req.cookies.get('token')?.value;

  // Check Authorization header if no cookie token
  if (!token) {
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
  }

  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return await User.findById(decoded.id);
  } catch (error) {
    return null;
  }
};

export async function DELETE(req, { params }) {
  await dbConnect();
  const user = await getUserFromRequest(req);
  const { id } = await params;

  if (!user) {
    return NextResponse.json({ success: false, error: 'Not authorized' }, { status: 401 });
  }

  try {
    const comment = await Comment.findById(id);

    if (!comment) {
      return NextResponse.json({ success: false, error: 'Comment not found' }, { status: 404 });
    }

    // Check if user is author or admin
    const isAuthor = comment.author.toString() === user._id.toString();
    const isAdmin = user.role === 'admin';

    if (!isAuthor && !isAdmin) {
      return NextResponse.json({ success: false, error: 'Not authorized to delete this comment' }, { status: 403 });
    }

    // Delete the comment
    await Comment.findByIdAndDelete(id);

    // Decrement post comment count
    await CommunityPost.findByIdAndUpdate(comment.post, { $inc: { commentsCount: -1 } });

    // Also delete any replies to this comment (optional but good practice)
    await Comment.deleteMany({ parentComment: id });

    return NextResponse.json({ success: true, message: 'Comment deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
