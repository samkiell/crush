import mongoose from 'mongoose';

const AttachmentSchema = new mongoose.Schema({
  url: String,
  type: String, // image | video | audio | pdf | raw
  publicId: String,
  size: Number,
  filename: String
}, { _id: false });

const CommentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Please provide a comment'],
    trim: true,
  },
  attachments: [AttachmentSchema],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CommunityPost',
    required: true,
  },
  parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null, // If null, it's a top-level comment
  },
  likes: {
    type: Number,
    default: 0,
  },
  isSolution: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Comment || mongoose.model('Comment', CommentSchema);
