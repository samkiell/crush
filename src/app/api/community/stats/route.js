import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import CommunityPost from '@/lib/models/CommunityPost';
import User from '@/lib/models/User';

export async function GET() {
  await dbConnect();

  try {
    const totalPosts = await CommunityPost.countDocuments();
    const totalUsers = await User.countDocuments();
    // Get top contributors (users with highest reputation)
    const topContributors = await User.find().sort({ reputation: -1 }).limit(3).select('name avatar reputation');
    
    // Get trending topics (tags from recent posts) - Simplified for now
    // In a real app, this would be an aggregation pipeline
    const trendingPosts = await CommunityPost.find().sort({ likes: -1 }).limit(3).select('title tags');
    const trendingTopics = [...new Set(trendingPosts.flatMap(p => p.tags))].slice(0, 5);

    return NextResponse.json({
      success: true,
      data: {
        activeUsers: totalUsers, // Proxy for now
        discussions: totalPosts,
        topContributors,
        trendingTopics,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
