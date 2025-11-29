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

// POST - Add reaction to a message
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
    const { emoji } = await request.json();
    
    if (!emoji) {
      return NextResponse.json(
        { success: false, error: 'Emoji is required' },
        { status: 400 }
      );
    }
    
    const message = await ChatMessage.findById(id);
    
    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message not found' },
        { status: 404 }
      );
    }
    
    // Check if user already reacted with this emoji
    const existingReaction = message.reactions.find(
      r => r.user.toString() === decoded.userId && r.emoji === emoji
    );
    
    if (existingReaction) {
      // Remove reaction (toggle)
      message.reactions = message.reactions.filter(
        r => !(r.user.toString() === decoded.userId && r.emoji === emoji)
      );
    } else {
      // Add reaction
      message.reactions.push({
        emoji,
        user: decoded.userId,
      });
    }
    
    await message.save();
    
    const updatedMessage = await ChatMessage.findById(id)
      .populate('sender', 'username avatar')
      .populate('reactions.user', 'username')
      .lean();
    
    return NextResponse.json({
      success: true,
      data: updatedMessage,
    });
  } catch (error) {
    console.error('Error adding reaction:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add reaction' },
      { status: 500 }
    );
  }
}
