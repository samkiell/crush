import mongoose from 'mongoose';

const ReactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  targetType: {
    type: String,
    enum: ['CommunityPost', 'Comment'],
    required: true,
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'targetType',
  },
  type: {
    type: String,
    enum: ['like', 'helpful'], // Can be expanded
    default: 'like',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Ensure a user can only react once per type to a target
ReactionSchema.index({ user: 1, targetId: 1, type: 1 }, { unique: true });

export default mongoose.models.Reaction || mongoose.model('Reaction', ReactionSchema);
