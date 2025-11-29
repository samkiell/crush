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

// GET - Fetch a specific chat room
export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    const { id } = await params;
    
    const room = await ChatRoom.findById(id)
      .populate('creator', 'username avatar')
      .populate('members', 'username avatar')
      .populate('admins', 'username avatar')
      .populate('lastMessage.sender', 'username avatar')
      .lean();
    
    if (!room) {
      return NextResponse.json(
        { success: false, error: 'Chat room not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: room,
    });
  } catch (error) {
    console.error('Error fetching chat room:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch chat room' },
      { status: 500 }
    );
  }
}

// PATCH - Update chat room (name, description, settings)
export async function PATCH(request, { params }) {
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
    const updates = await request.json();
    
    // Find room and check if user is admin
    const room = await ChatRoom.findById(id);
    
    if (!room) {
      return NextResponse.json(
        { success: false, error: 'Chat room not found' },
        { status: 404 }
      );
    }
    
    const isAdmin = room.admins.some(
      adminId => adminId.toString() === decoded.userId
    );
    
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Only admins can update the room' },
        { status: 403 }
      );
    }
    
    // Update allowed fields
    const allowedUpdates = ['name', 'description', 'settings'];
    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        room[key] = updates[key];
      }
    });
    
    await room.save();
    
    const updatedRoom = await ChatRoom.findById(id)
      .populate('creator', 'username avatar')
      .populate('members', 'username avatar')
      .populate('admins', 'username avatar')
      .lean();
    
    return NextResponse.json({
      success: true,
      data: updatedRoom,
    });
  } catch (error) {
    console.error('Error updating chat room:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update chat room' },
      { status: 500 }
    );
  }
}

// DELETE - Delete/deactivate chat room
export async function DELETE(request, { params }) {
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
    
    // Find room and check if user is creator
    const room = await ChatRoom.findById(id);
    
    if (!room) {
      return NextResponse.json(
        { success: false, error: 'Chat room not found' },
        { status: 404 }
      );
    }
    
    if (room.creator.toString() !== decoded.userId) {
      return NextResponse.json(
        { success: false, error: 'Only the creator can delete the room' },
        { status: 403 }
      );
    }
    
    // Soft delete
    room.isActive = false;
    await room.save();
    
    return NextResponse.json({
      success: true,
      message: 'Chat room deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting chat room:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete chat room' },
      { status: 500 }
    );
  }
}
