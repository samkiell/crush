// Utility to get the initialized Socket.IO instance
// This relies on the socket server being initialized in pages/api/socket/io.js
// and assigning the io instance to global.io

export const getIO = () => {
  if (!global.io) {
    console.warn(
      "Socket.io instance not found on global object. Ensure /api/socket/io has been hit."
    );
    return null;
  }
  return global.io;
};
