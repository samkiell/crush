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

// POST - Leave a chat room
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
    
    const { id } = params;
    const userId = decoded.userId;
    
    const room = await ChatRoom.findById(id);
    
    if (!room) {
      return NextResponse.json(
        { success: false, error: 'Chat room not found' },
        { status: 404 }
      );
    }
    
    // Check if user is a member
    if (!room.members.includes(userId)) {
      return NextResponse.json(
        { success: false, error: 'Not a member of this room' },
        { status: 400 }
      );
    }
    
    // Don't allow creator to leave
    if (room.creator.toString() === userId) {
      return NextResponse.json(
        { success: false, error: 'Creator cannot leave the room. Delete the room instead.' },
        { status: 400 }
      );
    }
    
    // Remove user from members and admins
    room.members = room.members.filter(memberId => memberId.toString() !== userId);
    room.admins = room.admins.filter(adminId => adminId.toString() !== userId);
    
    await room.save();
    
    return NextResponse.json({
      success: true,
      message: 'Successfully left the room',
    });
  } catch (error) {
    console.error('Error leaving chat room:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to leave chat room' },
      { status: 500 }
    );
  }
}
