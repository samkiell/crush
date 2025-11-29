import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ChatMessage from '@/models/ChatMessage';
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

// GET - Fetch messages for a room
export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get('roomId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const before = searchParams.get('before'); // For pagination
    
    if (!roomId) {
      return NextResponse.json(
        { success: false, error: 'Room ID is required' },
        { status: 400 }
      );
    }
    
    let query = {
      room: roomId,
      isDeleted: false,
    };
    
    if (before) {
      query.createdAt = { $lt: new Date(before) };
    }
    
    const messages = await ChatMessage.find(query)
      .populate('sender', 'name avatar')
      .populate('replyTo', 'content sender')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    
    // Reverse to show oldest first
    messages.reverse();
    
    return NextResponse.json({
      success: true,
      data: messages,
      hasMore: messages.length === limit,
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

// POST - Send a new message
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
    const { roomId, content, type, mediaUrl, replyTo } = body;
    
    // Validate required fields
    if (!roomId || !content) {
      return NextResponse.json(
        { success: false, error: 'Room ID and content are required' },
        { status: 400 }
      );
    }
    
    // Check if user is a member of the room
    const room = await ChatRoom.findById(roomId);
    
    if (!room) {
      return NextResponse.json(
        { success: false, error: 'Chat room not found' },
        { status: 404 }
      );
    }
    
    const isMember = room.members.some(
      memberId => memberId.toString() === decoded.userId
    );
    
    if (!isMember) {
      return NextResponse.json(
        { success: false, error: 'You must be a member to send messages' },
        { status: 403 }
      );
    }
    
    // Create message
    const newMessage = await ChatMessage.create({
      room: roomId,
      sender: decoded.userId,
      content,
      type: type || 'text',
      mediaUrl,
      replyTo,
    });
    
    // Update room's last message
    room.lastMessage = {
      content,
      sender: decoded.userId,
      timestamp: new Date(),
    };
    await room.save();
    
    const populatedMessage = await ChatMessage.findById(newMessage._id)
      .populate('sender', 'name avatar')
      .populate('replyTo', 'content sender')
      .lean();
    
    return NextResponse.json({
      success: true,
      data: populatedMessage,
    }, { status: 201 });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
