import { Server } from 'socket.io';

export default function handler(req, res) {
  if (res.socket.server.io) {
    console.log('Socket is already running');
    res.end();
    return;
  }

  console.log('Socket is initializing');
  const io = new Server(res.socket.server, {
    path: '/api/socket/io',
    addTrailingSlash: false,
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join_room', ({ roomId, userId }) => {
      socket.join(roomId);
      console.log(`User ${userId} joined room ${roomId}`);
    });

    socket.on('leave_room', ({ roomId }) => {
      socket.leave(roomId);
    });

    socket.on('send_message', (message) => {
      // Broadcast to everyone in the room INCLUDING sender (for simplicity in sync, 
      // though usually we optimistically update sender and only broadcast to others. 
      // But here we want to ensure consistency).
      // Actually, better to broadcast to others and let sender handle optimistic update.
      socket.to(message.room).emit('receive_message', message);
    });

    socket.on('typing_start', ({ roomId, username }) => {
      socket.to(roomId).emit('typing_start', { roomId, username, userId: socket.id });
    });

    socket.on('typing_stop', ({ roomId, username }) => {
      socket.to(roomId).emit('typing_stop', { roomId, username, userId: socket.id });
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

  res.socket.server.io = io;
  res.end();
}
