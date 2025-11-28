import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import CommunityPost from '@/lib/models/CommunityPost';
import User from '@/lib/models/User';

export async function GET(req, { params }) {
  await dbConnect();
  const { id } = await params;

  try {
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
