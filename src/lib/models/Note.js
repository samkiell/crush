import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    questionId: {
      type: String, // Can be null if note is just subject-based
      default: null,
    },
    subject: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Compound index for efficient querying
NoteSchema.index({ userId: 1, subject: 1 });
NoteSchema.index({ userId: 1, questionId: 1 });

export default mongoose.models.Note || mongoose.model("Note", NoteSchema);
