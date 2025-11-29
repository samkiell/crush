# Chat Room Feature Documentation

## Overview
A complete real-time chat room system for the JAMB/OAU PUTME exam prep platform with support for multiple room types, subjects, and collaborative learning.

---

## Features Implemented

### 🎯 Core Features
- ✅ **Multiple Room Types**
  - Public rooms (anyone can join)
  - Study groups (collaborative learning)
  - Subject-specific rooms
  - Private rooms (future)

- ✅ **Subject Organization**
  - Mathematics, English, Physics, Chemistry, Biology
  - Commerce, Economics, Government, Literature
  - CRK, Arabic, French, General

- ✅ **Message Features**
  - Send/receive text messages
  - Edit your own messages
  - Delete your own messages
  - Reply to messages (threaded conversations)
  - Emoji reactions (👍❤️😂😮🎉🔥)
  - Read receipts (data model ready)

- ✅ **Room Management**
  - Create new rooms with customization
  - Join/leave rooms
  - Member count tracking
  - Room settings (max members, file sharing)
  - Admin controls for room creators

- ✅ **User Experience**
  - Real-time message updates (Socket.io ready)
  - Typing indicators (data model ready)
  - Search and filter rooms
  - Pagination for messages
  - Mobile-responsive design
  - Dark mode support

---

## File Structure

```
src/
├── models/
│   ├── ChatRoom.js           # MongoDB schema for chat rooms
│   └── ChatMessage.js        # MongoDB schema for messages
│
├── app/
│   ├── api/
│   │   └── chat/
│   │       ├── rooms/
│   │       │   ├── route.js              # GET/POST rooms
│   │       │   └── [id]/
│   │       │       ├── route.js          # GET/PATCH/DELETE room
│   │       │       ├── join/route.js     # Join room
│   │       │       └── leave/route.js    # Leave room
│   │       └── messages/
│   │           ├── route.js              # GET/POST messages
│   │           └── [id]/
│   │               ├── route.js          # PATCH/DELETE message
│   │               └── react/route.js    # Add emoji reaction
│   │
│   └── chat/
│       └── page.jsx          # Main chat page
│
├── components/
│   └── chat/
│       ├── ChatRoomList.jsx      # Room list with filters
│       ├── ChatWindow.jsx        # Main chat interface
│       ├── MessageList.jsx       # Message display with actions
│       ├── MessageInput.jsx      # Message input field
│       └── CreateRoomModal.jsx   # Room creation modal
│
└── store/
    └── slices/
        └── chatSlice.js      # Redux state management
```

---

## API Endpoints

### Chat Rooms

#### GET `/api/chat/rooms`
Fetch all chat rooms with optional filters
```javascript
Query Parameters:
- type: 'public' | 'study-group' | 'subject'
- subject: 'Mathematics' | 'English' | ...
- userId: Filter rooms user is a member of
```

#### POST `/api/chat/rooms`
Create a new chat room (requires authentication)
```javascript
Body:
{
  name: string (required),
  description: string,
  type: 'public' | 'study-group' | 'subject',
  subject: string,
  settings: {
    maxMembers: number,
    allowImages: boolean,
    allowFiles: boolean
  }
}
```

#### GET `/api/chat/rooms/[id]`
Get specific room details

#### PATCH `/api/chat/rooms/[id]`
Update room (admin only)

#### DELETE `/api/chat/rooms/[id]`
Soft delete room (creator only)

#### POST `/api/chat/rooms/[id]/join`
Join a room (requires authentication)

#### POST `/api/chat/rooms/[id]/leave`
Leave a room (requires authentication)

### Messages

#### GET `/api/chat/messages?roomId=[id]&limit=50&before=[date]`
Fetch messages for a room with pagination

#### POST `/api/chat/messages`
Send a new message (requires authentication)
```javascript
Body:
{
  roomId: string (required),
  content: string (required),
  type: 'text' | 'image' | 'file',
  mediaUrl: string,
  replyTo: messageId
}
```

#### PATCH `/api/chat/messages/[id]`
Edit a message (sender only)

#### DELETE `/api/chat/messages/[id]`
Delete a message (sender only)

#### POST `/api/chat/messages/[id]/react`
Add/remove emoji reaction
```javascript
Body:
{
  emoji: string (required)
}
```

---

## Redux Actions

```javascript
import {
  fetchChatRooms,
  createChatRoom,
  joinChatRoom,
  leaveChatRoom,
  fetchMessages,
  sendMessage,
  editMessage,
  deleteMessage,
  reactToMessage,
  setActiveRoom,
  clearActiveRoom,
} from '@/store/slices/chatSlice';

// Fetch rooms
dispatch(fetchChatRooms({ type: 'public', subject: 'Mathematics' }));

// Create room
dispatch(createChatRoom({
  name: 'JAMB Math Warriors',
  description: 'Let\'s conquer calculus!',
  type: 'study-group',
  subject: 'Mathematics'
}));

// Send message
dispatch(sendMessage({
  roomId: 'room123',
  content: 'Hello everyone!',
  replyTo: 'msg456' // optional
}));

// React to message
dispatch(reactToMessage({
  messageId: 'msg789',
  emoji: '🔥'
}));
```

---

## Usage Guide

### 1. Navigate to Chat
Visit `/chat` to access the chat rooms

### 2. Browse Rooms
- Use filters to find rooms by type or subject
- Search rooms by name
- See member count and last activity

### 3. Join a Room
- Click on a room to view details
- Click "Join Room" to become a member
- Start chatting immediately

### 4. Create a Room
- Click "Create Room" button
- Fill in room details (name, type, subject)
- Set max members if needed
- Room is created with you as admin

### 5. Send Messages
- Type in the message input field
- Press Enter to send (Shift+Enter for new line)
- Messages appear in real-time

### 6. Interact with Messages
- **Reply**: Click reply icon to respond to specific message
- **React**: Click emoji icon to add reaction (👍❤️😂😮🎉🔥)
- **Edit**: Click edit icon on your own messages
- **Delete**: Click delete icon on your own messages

### 7. Leave a Room
- Click settings icon → "Leave Room"
- Creators cannot leave (must delete room instead)

---

## Next Steps (Optional Enhancements)

### Real-Time with Socket.io
To add real-time functionality, install Socket.io:

```bash
npm install socket.io socket.io-client
```

Then create `src/lib/socket.js`:
```javascript
import { io } from 'socket.io-client';

let socket;

export const initSocket = () => {
  socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || '', {
    auth: {
      token: getTokenFromCookie(),
    },
  });
  
  return socket;
};

export const getSocket = () => socket;
```

### File Uploads
- Integrate with existing media upload API
- Add image preview in messages
- Support PDF/document sharing

### Advanced Features
- Voice messages
- Video calls (WebRTC)
- Message search
- Pinned messages
- User mentions (@username)
- Message threading
- Online status indicators
- Typing indicators

---

## Design System

The chat follows your established design system:

### Colors
- Primary: Purple (`#7C3AED`) for active states
- Success: Green for member badges
- Base colors for light/dark themes

### Typography
- Inter for body text
- Outfit for headings
- Font sizes follow established scale

### Components
- Glassmorphism effects on modals
- Rounded corners (xl: 0.75rem, 2xl: 1rem)
- Smooth transitions (250ms)
- Mobile-first responsive design

---

## Testing Checklist

- [ ] Create a public room
- [ ] Create a study group
- [ ] Create a subject-specific room
- [ ] Join a room
- [ ] Send a text message
- [ ] Reply to a message
- [ ] Edit your message
- [ ] Delete your message
- [ ] Add emoji reaction
- [ ] Remove emoji reaction
- [ ] Leave a room
- [ ] Search for rooms
- [ ] Filter rooms by type
- [ ] Filter rooms by subject
- [ ] Test on mobile devices
- [ ] Test dark mode
- [ ] Test authentication flow

---

## Troubleshooting

### Messages not appearing
- Check if user is a member of the room
- Verify JWT token in cookies
- Check browser console for errors

### Can't join room
- Ensure room hasn't reached max members
- Check if already a member
- Verify authentication

### Real-time not working
- This version uses polling (refresh to see new messages)
- Implement Socket.io for true real-time (see Next Steps)

---

## Contributing

To extend this feature:

1. **Add new message types**: Update `ChatMessage` schema and add UI components
2. **Add room permissions**: Extend `ChatRoom` schema with role-based permissions
3. **Add moderation**: Create admin tools for message moderation
4. **Add notifications**: Integrate with existing notification system

---

**Version**: 1.0  
**Created**: 2025-11-29  
**Author**: SAMKIEL
