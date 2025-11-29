import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import CommunityPost from '@/lib/models/CommunityPost';
import Comment from '@/lib/models/Comment';
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

export async function GET(req, { params }) {
  const { id } = await params;

  try {
    await dbConnect();
    const post = await CommunityPost.findById(id).populate('author', 'name avatar badges reputation');

    if (!post) {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
    }

    // Increment views (simple implementation, ideally should be debounced/IP tracked)
    post.views += 1;
    await post.save();

    return NextResponse.json({ success: true, data: post });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const { id } = await params;

  try {
    await dbConnect();
    const user = await getUserFromRequest(req);

    if (!user) {
      return NextResponse.json({ success: false, error: 'Not authorized' }, { status: 401 });
    }

    const post = await CommunityPost.findById(id);

    if (!post) {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
    }

    // Check if user is author or admin
    const isAuthor = post.author.toString() === user._id.toString();
    const isAdmin = user.role === 'admin';

    if (!isAuthor && !isAdmin) {
      return NextResponse.json({ success: false, error: 'Not authorized to delete this post' }, { status: 403 });
    }

    // Delete the post
    await CommunityPost.findByIdAndDelete(id);

    // Delete associated comments
    await Comment.deleteMany({ post: id });

    return NextResponse.json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
