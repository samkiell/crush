import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import CommunityPost from '@/lib/models/CommunityPost';
import User from '@/lib/models/User';
import jwt from 'jsonwebtoken';
import { filterProfanity } from '@/utils/moderation';
import { apiHandler } from '@/lib/apiHandler';

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

export const GET = apiHandler(async (req) => {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 10;
  const sort = searchParams.get('sort') || 'latest'; // latest, popular, unsolved
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const tag = searchParams.get('tag'); // New: filter by tag

  const query = {};
  if (category) query.category = category;
  if (search) {
    query.$text = { $search: search };
  }
  if (tag) {
    query.tags = tag; // Filter posts that include this tag
  }
  
  const user = searchParams.get('user');
  if (user) {
    // Find user by username first to get ID
    const author = await User.findOne({ username: user });
    if (author) {
      query.author = author._id;
    } else {
      // If user not found, return empty
      return NextResponse.json({
        success: true,
        data: [],
        pagination: { page, limit, total: 0, pages: 0 },
      });
    }
  }

  let sortOption = { createdAt: -1 };
  if (sort === 'popular') sortOption = { likes: -1 };
  if (sort === 'unsolved') {
    query.isQuestion = true;
    query.isSolved = false;
  }

  await dbConnect();
  const posts = await CommunityPost.find(query)
    .sort(sortOption)
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('author', 'name username avatar badges reputation');

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
});

export const POST = apiHandler(async (req) => {
  await dbConnect();
  const user = await getUserFromRequest(req);

  if (!user) {
    const error = new Error('Not authorized');
    error.statusCode = 401;
    throw error;
  }

  const body = await req.json();
  const { title, content, category, tags, isQuestion } = body;

  if (!title || !content || !category) {
    const error = new Error('Please provide all required fields');
    error.statusCode = 400;
    throw error;
  }

  const cleanTitle = filterProfanity(title);
  const cleanContent = filterProfanity(content);

  const post = await CommunityPost.create({
    title: cleanTitle,
    content: cleanContent,
    category,
    tags: tags || [],
    attachments: body.attachments || [],
    isQuestion: isQuestion || false,
    author: user._id,
  });

  return NextResponse.json({ success: true, data: post }, { status: 201 });
});
