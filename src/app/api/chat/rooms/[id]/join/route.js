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

// POST - Join a chat room
export async function POST(request, { params }) {
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
    
    const { id } = await params;
    const userId = decoded.userId;
    
    console.log(`[JOIN] Attempting to join room: ${id} by user: ${userId}`);

    const room = await ChatRoom.findById(id);
    
    if (!room) {
      console.log(`[JOIN] Room not found for ID: ${id}`);
      return NextResponse.json(
        { success: false, error: 'Chat room not found' },
        { status: 404 }
      );
    }
    
    // Check if already a member
    const isMember = room.members.some(memberId => memberId.toString() === userId);
    
    if (isMember) {
      const populatedRoom = await ChatRoom.findById(id)
        .populate('creator', 'username avatar')
        .populate('members', 'username avatar')
        .lean();

      return NextResponse.json({
        success: true,
        data: populatedRoom,
        message: 'Already a member',
      });
    }
    
    // Check max members limit
    if (room.members.length >= room.settings.maxMembers) {
      return NextResponse.json(
        { success: false, error: 'Room is full' },
        { status: 400 }
      );
    }
    
    // Add user to members
    room.members.push(userId);
    await room.save();
    
    const updatedRoom = await ChatRoom.findById(id)
      .populate('creator', 'username avatar')
      .populate('members', 'username avatar')
      .lean();
    
    return NextResponse.json({
      success: true,
      data: updatedRoom,
      message: 'Successfully joined the room',
    });
  } catch (error) {
    console.error('Error joining chat room:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to join chat room' },
      { status: 500 }
    );
  }
}
