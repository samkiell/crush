import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/services/api';

// Async thunks
export const fetchChatRooms = createAsyncThunk(
  'chat/fetchRooms',
  async ({ type, subject, userId } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (type) params.append('type', type);
      if (subject) params.append('subject', subject);
      if (userId) params.append('userId', userId);
      
      const response = await api.get(`/chat/rooms?${params}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch rooms');
    }
  }
);

export const createChatRoom = createAsyncThunk(
  'chat/createRoom',
  async (roomData, { rejectWithValue }) => {
    try {
      const response = await api.post('/chat/rooms', roomData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create room');
    }
  }
);

export const joinChatRoom = createAsyncThunk(
  'chat/joinRoom',
  async (roomId, { rejectWithValue }) => {
    try {
      // Using fetch with credentials: 'include' as requested to ensure cookies are sent
      const response = await fetch(`/api/chat/rooms/${roomId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to join room');
      }

      return data.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to join room');
    }
  }
);

export const leaveChatRoom = createAsyncThunk(
  'chat/leaveRoom',
  async (roomId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/chat/rooms/${roomId}/leave`);
      return { roomId, message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to leave room');
    }
  }
);

export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async ({ roomId, before, limit = 50 }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({ roomId, limit: limit.toString() });
      if (before) params.append('before', before);
      
      const response = await api.get(`/chat/messages?${params}`);
      return {
        roomId,
        messages: response.data.data,
        hasMore: response.data.hasMore,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch messages');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (messageData, { rejectWithValue }) => {
    try {
      const response = await api.post('/chat/messages', messageData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to send message');
    }
  }
);

export const editMessage = createAsyncThunk(
  'chat/editMessage',
  async ({ messageId, content }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/chat/messages/${messageId}`, { content });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to edit message');
    }
  }
);

export const deleteMessage = createAsyncThunk(
  'chat/deleteMessage',
  async (messageId, { rejectWithValue }) => {
    try {
      await api.delete(`/chat/messages/${messageId}`);
      return messageId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete message');
    }
  }
);

export const reactToMessage = createAsyncThunk(
  'chat/reactToMessage',
  async ({ messageId, emoji }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/chat/messages/${messageId}/react`, { emoji });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to add reaction');
    }
  }
);

// Slice
const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    rooms: [],
    activeRoom: null,
    messages: {},
    onlineUsers: [],
    typingUsers: {},
    loading: false,
    error: null,
    hasMore: {},
  },
  reducers: {
    setActiveRoom: (state, action) => {
      state.activeRoom = action.payload;
    },
    clearActiveRoom: (state) => {
      state.activeRoom = null;
    },
    addMessageOptimistic: (state, action) => {
      const { roomId, message } = action.payload;
      if (!state.messages[roomId]) {
        state.messages[roomId] = [];
      }
      state.messages[roomId].push(message);
    },
    receiveMessage: (state, action) => {
      const message = action.payload;
      const roomId = message.room;
      
      if (!state.messages[roomId]) {
        state.messages[roomId] = [];
      }
      
      // Avoid duplicates
      const exists = state.messages[roomId].some(m => m._id === message._id);
      if (!exists) {
        state.messages[roomId].push(message);
      }
      
      // Update room's last message
      const room = state.rooms.find(r => r._id === roomId);
      if (room) {
        room.lastMessage = {
          content: message.content,
          sender: message.sender,
          timestamp: message.createdAt,
        };
      }
    },
    updateMessageInState: (state, action) => {
      const updatedMessage = action.payload;
      const roomId = updatedMessage.room;
      
      if (state.messages[roomId]) {
        const index = state.messages[roomId].findIndex(m => m._id === updatedMessage._id);
        if (index !== -1) {
          state.messages[roomId][index] = updatedMessage;
        }
      }
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    setTypingUser: (state, action) => {
      const { roomId, userId, username, isTyping } = action.payload;
      
      if (!state.typingUsers[roomId]) {
        state.typingUsers[roomId] = [];
      }
      
      if (isTyping) {
        const exists = state.typingUsers[roomId].some(u => u.userId === userId);
        if (!exists) {
          state.typingUsers[roomId].push({ userId, username });
        }
      } else {
        state.typingUsers[roomId] = state.typingUsers[roomId].filter(u => u.userId !== userId);
      }
    },
    clearMessages: (state, action) => {
      const roomId = action.payload;
      if (roomId) {
        delete state.messages[roomId];
      } else {
        state.messages = {};
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch rooms
      .addCase(fetchChatRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChatRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms = action.payload;
      })
      .addCase(fetchChatRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create room
      .addCase(createChatRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createChatRoom.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms.unshift(action.payload);
      })
      .addCase(createChatRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Join room
      .addCase(joinChatRoom.fulfilled, (state, action) => {
        const index = state.rooms.findIndex(r => r._id === action.payload._id);
        if (index !== -1) {
          state.rooms[index] = action.payload;
        }
      })
      
      // Leave room
      .addCase(leaveChatRoom.fulfilled, (state, action) => {
        state.rooms = state.rooms.filter(r => r._id !== action.payload.roomId);
        if (state.activeRoom?._id === action.payload.roomId) {
          state.activeRoom = null;
        }
      })
      
      // Fetch messages
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        const { roomId, messages, hasMore } = action.payload;
        
        if (state.messages[roomId]) {
          // Prepend older messages (pagination)
          state.messages[roomId] = [...messages, ...state.messages[roomId]];
        } else {
          state.messages[roomId] = messages;
        }
        
        state.hasMore[roomId] = hasMore;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Send message
      .addCase(sendMessage.fulfilled, (state, action) => {
        const message = action.payload;
        const roomId = message.room;
        
        if (!state.messages[roomId]) {
          state.messages[roomId] = [];
        }
        
        // Check if message already exists (from socket)
        const exists = state.messages[roomId].some(m => m._id === message._id);
        if (!exists) {
          state.messages[roomId].push(message);
        }
      })
      
      // Edit message
      .addCase(editMessage.fulfilled, (state, action) => {
        const updatedMessage = action.payload;
        const roomId = updatedMessage.room;
        
        if (state.messages[roomId]) {
          const index = state.messages[roomId].findIndex(m => m._id === updatedMessage._id);
          if (index !== -1) {
            state.messages[roomId][index] = updatedMessage;
          }
        }
      })
      
      // Delete message
      .addCase(deleteMessage.fulfilled, (state, action) => {
        const messageId = action.payload;
        
        // Find and update the deleted message in all rooms
        Object.keys(state.messages).forEach(roomId => {
          const index = state.messages[roomId].findIndex(m => m._id === messageId);
          if (index !== -1) {
            state.messages[roomId][index].isDeleted = true;
            state.messages[roomId][index].content = '[Message deleted]';
          }
        });
      })
      
      // React to message
      .addCase(reactToMessage.fulfilled, (state, action) => {
        const updatedMessage = action.payload;
        const roomId = updatedMessage.room;
        
        if (state.messages[roomId]) {
          const index = state.messages[roomId].findIndex(m => m._id === updatedMessage._id);
          if (index !== -1) {
            state.messages[roomId][index] = updatedMessage;
          }
        }
      });
  },
});

export const {
  setActiveRoom,
  clearActiveRoom,
  addMessageOptimistic,
  receiveMessage,
  updateMessageInState,
  setOnlineUsers,
  setTypingUser,
  clearMessages,
} = chatSlice.actions;

export default chatSlice.reducer;
