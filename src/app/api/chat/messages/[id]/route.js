import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ChatMessage from '@/models/ChatMessage';
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

// PATCH - Edit a message
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
    
    const { id } = params;
    const { content } = await request.json();
    
    const message = await ChatMessage.findById(id);
    
    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message not found' },
        { status: 404 }
      );
    }
    
    // Check if user is the sender
    if (message.sender.toString() !== decoded.userId) {
      return NextResponse.json(
        { success: false, error: 'You can only edit your own messages' },
        { status: 403 }
      );
    }
    
    message.content = content;
    message.isEdited = true;
    message.editedAt = new Date();
    
    await message.save();
    
    const updatedMessage = await ChatMessage.findById(id)
      .populate('sender', 'username avatar')
      .populate('replyTo', 'content sender')
      .lean();
    
    return NextResponse.json({
      success: true,
      data: updatedMessage,
    });
  } catch (error) {
    console.error('Error editing message:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to edit message' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a message
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
    
    const { id } = params;
    
    const message = await ChatMessage.findById(id);
    
    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message not found' },
        { status: 404 }
      );
    }
    
    // Check if user is the sender
    if (message.sender.toString() !== decoded.userId) {
      return NextResponse.json(
        { success: false, error: 'You can only delete your own messages' },
        { status: 403 }
      );
    }
    
    // Soft delete
    message.isDeleted = true;
    message.deletedAt = new Date();
    message.content = '[Message deleted]';
    
    await message.save();
    
    return NextResponse.json({
      success: true,
      message: 'Message deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete message' },
      { status: 500 }
    );
  }
}
