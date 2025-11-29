import mongoose from 'mongoose';

const CommunityPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    maxlength: [150, 'Title cannot be more than 150 characters'],
    trim: true,
  },
  content: {
    type: String,
    required: [true, 'Please provide content'],
  },
  attachments: [{
    url: String,
    type: String, // image | video | audio | pdf | raw
    publicId: String,
    size: Number,
    filename: String
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tags: [{
    type: String,
    trim: true,
  }],
  category: {
    type: String,
    enum: ['General', 'Exam Help', 'Study Tips', 'Career', 'Off-Topic'],
    default: 'General',
  },
  likes: {
    type: Number,
    default: 0,
  },
  views: {
    type: Number,
    default: 0,
  },
  commentsCount: {
    type: Number,
    default: 0,
  },
  isQuestion: {
    type: Boolean,
    default: false,
  },
  isSolved: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for search and filtering
CommunityPostSchema.index({ title: 'text', content: 'text', tags: 'text' });
CommunityPostSchema.index({ createdAt: -1 });
CommunityPostSchema.index({ likes: -1 });

export default mongoose.models.CommunityPost || mongoose.model('CommunityPost', CommunityPostSchema);
