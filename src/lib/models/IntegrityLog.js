import mongoose from "mongoose";

// Force model rebuild in development
if (process.env.NODE_ENV === "development") {
  delete mongoose.models.IntegrityLog;
}

const IntegrityLogSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
  },
  eventType: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  details: { type: mongoose.Schema.Types.Mixed },
  severity: {
    type: String,
    enum: ["low", "medium", "high", "critical"],
    default: "low",
  },
});

export default mongoose.models.IntegrityLog ||
  mongoose.model("IntegrityLog", IntegrityLogSchema);
