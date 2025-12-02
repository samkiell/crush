import mongoose from "mongoose";

const CbtSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subject: { type: String, required: true },
    year: { type: Number, required: true },
    mode: { type: String, enum: ["cbt", "study"], default: "cbt" },
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date, required: true },
    status: {
      type: String,
      enum: ["active", "submitted", "locked", "invalidated"],
      default: "active",
    },
    score: { type: Number },
    totalQuestions: { type: Number, required: true },
    answeredCount: { type: Number, default: 0 },
    integrityScore: { type: Number, default: 100 },
    clientSessionId: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.CbtSession ||
  mongoose.model("CbtSession", CbtSessionSchema);
