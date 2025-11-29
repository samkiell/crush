import mongoose from 'mongoose';

const ChatRoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  type: {
    type: String,
    enum: ['public', 'study-group', 'subject', 'private'],
    default: 'public',
  },
  subject: {
    type: String,
    enum: ['General', 'Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'Commerce', 'Economics', 'Government', 'Literature', 'CRK', 'Arabic', 'French'],
    default: 'General',
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  admins: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  lastMessage: {
    content: String,
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    timestamp: Date,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  memberCount: {
    type: Number,
    default: 0,
  },
  settings: {
    allowImages: {
      type: Boolean,
      default: true,
    },
    allowFiles: {
      type: Boolean,
      default: false,
    },
    maxMembers: {
      type: Number,
      default: 100,
    },
    requireApproval: {
      type: Boolean,
      default: false,
    },
  },
}, {
  timestamps: true,
});

// Update member count before saving
ChatRoomSchema.pre('save', function(next) {
  this.memberCount = this.members.length;
  next();
});

// Indexes for performance
ChatRoomSchema.index({ type: 1, subject: 1 });
ChatRoomSchema.index({ members: 1 });
ChatRoomSchema.index({ createdAt: -1 });

export default mongoose.models.ChatRoom || mongoose.model('ChatRoom', ChatRoomSchema);
