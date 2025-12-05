import mongoose from "mongoose";

const AnnouncementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title for the announcement"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    message: {
      type: String,
      required: [true, "Please provide a message for the announcement"],
      trim: true,
    },
    link: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      enum: ["post", "system", "maintenance", "update", "info"],
      default: "system",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    expiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index for fetching active announcements sorted by creation date
AnnouncementSchema.index({ createdAt: -1 });
AnnouncementSchema.index({ isActive: 1, createdAt: -1 });

export default mongoose.models.Announcement ||
  mongoose.model("Announcement", AnnouncementSchema);
