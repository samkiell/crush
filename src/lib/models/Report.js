import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema({
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  targetType: {
    type: String,
    enum: ["CommunityPost", "Comment", "Question"],
    required: true,
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "targetType",
  },
  // For Question reports
  subject: { type: String },
  year: { type: String },
  qid: { type: String },

  reason: {
    type: String,
    required: true,
    enum: [
      "Spam",
      "Harassment",
      "Inappropriate Content",
      "Misinformation",
      "Wrong Answer",
      "Typo",
      "Other",
    ],
  },
  description: {
    type: String,
    maxlength: 500,
  },
  status: {
    type: String,
    enum: ["pending", "resolved", "dismissed"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Report || mongoose.model("Report", ReportSchema);
