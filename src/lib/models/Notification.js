import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null, // null means "all users" (global notification)
  },
  type: {
    type: String,
    enum: [
      "system",
      "community_post",
      "community_reply",
      "community_like",
      "info",
      "alert",
    ],
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  link: {
    type: String,
    trim: true,
  },
  data: {
    type: mongoose.Schema.Types.Mixed, // Flexible field for extra data (e.g., postId, senderId)
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  readBy: [
    {
      // For global notifications, track who has read it
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 60 * 24 * 30, // Auto-delete after 30 days
  },
});

// Indexes for performance
NotificationSchema.index({ recipient: 1, createdAt: -1 });
NotificationSchema.index({ recipient: 1, isRead: 1 });

export default mongoose.models.Notification ||
  mongoose.model("Notification", NotificationSchema);
