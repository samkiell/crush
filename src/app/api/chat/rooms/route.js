import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ChatRoom from '@/models/ChatRoom';
import { authorizeAdmin, protect } from '@/lib/auth';

// GET - Fetch all chat rooms
export async function GET(request) {
  try {
    // Ensure the request is from an authenticated user
    const user = await protect(request);
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
  }
}

// POST - Create a new chat room
export async function POST(request) {
  try {
    await dbConnect();
    
    // Verify authentication and admin role
    // First, ensure the request is from an authenticated user
    const authUser = await protect(request);
    let user;
    try {
      // Only admins are allowed to create rooms
      user = await authorizeAdmin(request);

    } catch (error) {
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ChatRoom from '@/models/ChatRoom';
import { authorizeAdmin, protect } from '@/lib/auth';

// GET - Fetch all chat rooms for the authenticated user
export async function GET(request) {
  try {
    // Ensure the request is from an authenticated user
    const user = await protect(request);
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const subject = searchParams.get('subject');
    const userId = user._id.toString();

    let query = { isActive: true };
    if (type) query.type = type;
    if (subject && subject !== 'General') query.subject = subject;
    // Only return rooms that the authenticated user is a member of
    if (userId) query.members = userId;

    const rooms = await ChatRoom.find(query)
      .populate('creator', 'name avatar')
      .populate('lastMessage.sender', 'name avatar')
      .sort({ 'lastMessage.timestamp': -1, createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: rooms });
  } catch (error) {
    console.error('Error fetching chat rooms:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch chat rooms' }, { status: 500 });
  }
}

// POST - Create a new chat room (admin only)
export async function POST(request) {
  try {
    await dbConnect();
    // Verify authentication and admin role
    const authUser = await protect(request);
    let user;
    try {
      user = await authorizeAdmin(request);
    } catch (error) {
      return NextResponse.json({ success: false, error: error.message || 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { name, description, type, subject, settings } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json({ success: false, error: 'Room name is required' }, { status: 400 });
    }

    // Create new room
    const newRoom = await ChatRoom.create({
      name,
      description,
      type: type || 'public',
      subject: subject || 'General',
      creator: user._id,
      admins: [user._id],
      members: [user._id],
      settings: settings || {},
    });

    const populatedRoom = await ChatRoom.findById(newRoom._id)
      .populate('creator', 'name avatar')
      .lean();

    return NextResponse.json({ success: true, data: populatedRoom }, { status: 201 });
  } catch (error) {
    console.error('Error creating chat room:', error);
    return NextResponse.json({ success: false, error: 'Failed to create chat room' }, { status: 500 });
  }
}
