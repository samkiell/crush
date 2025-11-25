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
    
    // Get trending topics (tags from recent posts with high engagement)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const trendingTagsAggregation = await CommunityPost.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      { $unwind: '$tags' },
      {
        $group: {
          _id: '$tags',
          score: { $sum: { $add: ['$likes', '$commentsCount', 1] } }, // 1 point per post, plus likes and comments
          count: { $sum: 1 }
        }
      },
      { $sort: { score: -1 } },
      { $limit: 5 }
    ]);

    const trendingTopics = trendingTagsAggregation.map(t => t._id);

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
