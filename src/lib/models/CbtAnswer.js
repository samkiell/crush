import mongoose from "mongoose";

// Force model rebuild in development
if (process.env.NODE_ENV === "development") {
  delete mongoose.models.CbtAnswer;
}

const CbtAnswerSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    qIndex: {
      type: Number,
      required: true,
    },
    answer: {
      type: String, // 'A', 'B', 'C', 'D'
      required: true,
    },
    correct: {
      type: Boolean,
      required: true,
    },
    tutorExplanation: String,
    aiExplanation: String,
  },
  {
    timestamps: true,
  }
);

// Compound index for unique answer per question per session
CbtAnswerSchema.index({ sessionId: 1, qIndex: 1 }, { unique: true });

export default mongoose.models.CbtAnswer ||
  mongoose.model("CbtAnswer", CbtAnswerSchema);
