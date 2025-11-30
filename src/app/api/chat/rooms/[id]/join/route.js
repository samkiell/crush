import dbConnect from '@/lib/db';
import ChatRoom from '@/models/ChatRoom';
import { protect } from '@/lib/auth';

// POST - Join a chat room
// POST - Join a chat room
export async function POST(request, { params }) {
  try {
    await dbConnect();
    
    // Verify authentication using the standard middleware
    let user;
    try {
      user = await protect(request);
    } catch (authError) {
      console.error('[JOIN] Auth failed:', authError.message);
      return Response.json(
        { success: false, message: 'Unauthorized: ' + authError.message },
        { status: 401 }
      );
    }
    
    const { id } = await params;
    
    console.log(`[JOIN] Attempting to join room: ${id} by user: ${user._id}`);

    const room = await ChatRoom.findById(id);
    
    if (!room) {
      console.log(`[JOIN] Room not found for ID: ${id}`);
      return Response.json(
        { success: false, message: 'Chat room not found' },
        { status: 404 }
      );
    }
    
    // Check if already a member
    // Defensive check: filter out any null/undefined members from the array to prevent crashes
    const isMember = room.members
      .filter(memberId => memberId) // Filter out nulls
      .some(memberId => memberId.toString() === user._id.toString());
    
    if (isMember) {
      console.log(`[JOIN] User ${user._id} is already a member of room ${id}`);
      const populatedRoom = await ChatRoom.findById(id)
        .populate('creator', 'username avatar')
        .populate('members', 'username avatar')
        .lean();

      return Response.json({
        success: true,
        data: populatedRoom,
        message: 'Already a member',
      });
    }
    
    // Check max members limit
    if (room.settings && room.settings.maxMembers && room.members.length >= room.settings.maxMembers) {
      console.log(`[JOIN] Room ${id} is full`);
      return Response.json(
        { success: false, message: 'Room is full' },
        { status: 400 }
      );
    }
    
    // Add user to members
    room.members.push(user._id);
    await room.save();
    console.log(`[JOIN] User ${user._id} successfully joined room ${id}`);
    
    const updatedRoom = await ChatRoom.findById(id)
      .populate('creator', 'username avatar')
      .populate('members', 'username avatar')
      .lean();
    
    return Response.json({
      success: true,
      data: updatedRoom,
      message: 'Successfully joined the room',
    });
  } catch (error) {
    console.error('Error joining chat room:', error);
    return Response.json(
      { success: false, message: 'Unable to join room: ' + error.message },
      { status: 500 }
    );
  }
}
