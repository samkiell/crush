import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import CommunityPost from '@/lib/models/CommunityPost';
import User from '@/lib/models/User';
import jwt from 'jsonwebtoken';
import { filterProfanity } from '@/utils/moderation';

// Helper to get user from token
const getUserFromRequest = async (req) => {
  let token = req.cookies.get('token')?.value;

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

export async function GET(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 10;
  const sort = searchParams.get('sort') || 'latest'; // latest, popular, unsolved
  const category = searchParams.get('category');
  const search = searchParams.get('search');

  const query = {};
  if (category) query.category = category;
  if (search) {
    query.$text = { $search: search };
  }

  let sortOption = { createdAt: -1 };
  if (sort === 'popular') sortOption = { likes: -1 };
  if (sort === 'unsolved') {
    query.isQuestion = true;
    query.isSolved = false;
  }

  try {
    const posts = await CommunityPost.find(query)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('author', 'name avatar badges reputation');

    const total = await CommunityPost.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  await dbConnect();
  const user = await getUserFromRequest(req);

  if (!user) {
    return NextResponse.json({ success: false, error: 'Not authorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, content, category, tags, isQuestion } = body;

    if (!title || !content || !category) {
      return NextResponse.json({ success: false, error: 'Please provide all required fields' }, { status: 400 });
    }

    const cleanTitle = filterProfanity(title);
    const cleanContent = filterProfanity(content);

    const post = await CommunityPost.create({
      title: cleanTitle,
      content: cleanContent,
      category,
      tags: tags || [],
      isQuestion: isQuestion || false,
      author: user._id,
    });

    return NextResponse.json({ success: true, data: post }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
