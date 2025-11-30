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
    // Visibility: Show room if it's NOT private OR if the user is a member
    query.$or = [
      { type: { $ne: 'private' } },
      { members: userId }
    ];

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

    // Ensure request is from an authenticated user
    await protect(request);
    let user;
    try {
      user = await authorizeAdmin(request);
    } catch (error) {
      return NextResponse.json({ success: false, error: error.message || 'Forbidden' }, { status: 403 });
    }

    const { name, description, type, subject, settings } = await request.json();

    if (!name) {
      return NextResponse.json({ success: false, error: 'Room name is required' }, { status: 400 });
    }

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
