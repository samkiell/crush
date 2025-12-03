import mongoose from "mongoose";

// Force model rebuild in development
if (process.env.NODE_ENV === "development") {
  delete mongoose.models.CbtSession;
}

const CbtSessionSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    questions: [
      {
        qid: String,
        index: Number,
      },
    ],
    startTime: {
      type: Date,
      default: Date.now,
    },
    endTime: Date,
    mode: {
      type: String,
      enum: ["cbt", "study"],
      default: "cbt",
    },
    status: {
      type: String,
      enum: ["active", "submitted", "locked"],
      default: "active",
    },
    summary: {
      totalQuestions: Number,
      correct: Number,
      wrong: Number,
      unanswered: Number,
      percentage: Number,
      score: Number,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.CbtSession ||
  mongoose.model("CbtSession", CbtSessionSchema);
