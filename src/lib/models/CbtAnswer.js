import mongoose from "mongoose";

const CbtAnswerSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true },
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
    selectedOption: { type: String },
    isCorrect: { type: Boolean },
    timeSpent: { type: Number },
    syncedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

CbtAnswerSchema.index({ sessionId: 1, questionId: 1 }, { unique: true });

export default mongoose.models.CbtAnswer ||
  mongoose.model("CbtAnswer", CbtAnswerSchema);
