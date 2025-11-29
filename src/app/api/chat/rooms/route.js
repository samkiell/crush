import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ChatRoom from '@/models/ChatRoom';
import jwt from 'jsonwebtoken';

// Helper to verify JWT
const verifyToken = (request) => {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.split(' ')[1];
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// GET - Fetch all chat rooms
export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const subject = searchParams.get('subject');
    const userId = searchParams.get('userId');
    
    let query = { isActive: true };
    
    if (type) {
      query.type = type;
    }
    
    if (subject && subject !== 'General') {
      query.subject = subject;
    }
    
    if (userId) {
      query.members = userId;
    }
    
    const rooms = await ChatRoom.find(query)
      .populate('creator', 'name avatar')
      .populate('lastMessage.sender', 'name avatar')
      .sort({ 'lastMessage.timestamp': -1, createdAt: -1 })
      .lean();
    
    return NextResponse.json({
      success: true,
      data: rooms,
    });
  } catch (error) {
    console.error('Error fetching chat rooms:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch chat rooms' },
      { status: 500 }
    );
  }
}

// POST - Create a new chat room
export async function POST(request) {
  try {
    await dbConnect();
    
    // Verify authentication
    const decoded = verifyToken(request);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { name, description, type, subject, settings } = body;
    
    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Room name is required' },
        { status: 400 }
      );
    }
    
    // Create new room
    const newRoom = await ChatRoom.create({
      name,
      description,
      type: type || 'public',
      subject: subject || 'General',
      creator: decoded.userId,
      admins: [decoded.userId],
      members: [decoded.userId],
      settings: settings || {},
    });
    
    const populatedRoom = await ChatRoom.findById(newRoom._id)
      .populate('creator', 'name avatar')
      .lean();
    
    return NextResponse.json({
      success: true,
      data: populatedRoom,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating chat room:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create chat room' },
      { status: 500 }
    );
  }
}
