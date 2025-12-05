import mongoose from "mongoose";

const ExperimentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide an experiment name"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    variants: [
      {
        name: { type: String, required: true }, // e.g., "control", "variant-a"
        weight: { type: Number, default: 50 }, // Percentage allocation
      },
    ],
    status: {
      type: String,
      enum: ["draft", "running", "paused", "completed"],
      default: "draft",
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    metrics: {
      impressions: { type: Number, default: 0 },
      conversions: { type: Number, default: 0 },
    },
    // We can store aggregated results here or calculate on the fly
    results: {
      type: Map,
      of: new mongoose.Schema({
        impressions: { type: Number, default: 0 },
        conversions: { type: Number, default: 0 },
      }),
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Experiment ||
  mongoose.model("Experiment", ExperimentSchema);
