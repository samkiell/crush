import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Experiment from "@/lib/models/Experiment";

export async function POST(req) {
  try {
    await dbConnect();
    const { experimentId, variant, type } = await req.json();

    if (!experimentId || !variant || !type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const updateField =
      type === "conversion" ? "metrics.conversions" : "metrics.impressions";
    const variantUpdateField =
      type === "conversion"
        ? "results.$[elem].conversions"
        : "results.$[elem].impressions";

    // Update global metrics and variant specific metrics
    // Note: 'results' is a Map in the schema, but updating maps in Mongoose via findOneAndUpdate can be tricky.
    // The schema defined 'results' as a Map. Let's adjust the update logic or schema usage.
    // Actually, in the schema I defined:
    // results: { type: Map, of: new Schema({ ... }) }
    // Updating a specific key in a Map is done via `results.variantName.impressions`.

    // Construct the dynamic update object
    const incObject = {
      [updateField]: 1,
      [`results.${variant}.${
        type === "conversion" ? "conversions" : "impressions"
      }`]: 1,
    };

    await Experiment.findByIdAndUpdate(experimentId, { $inc: incObject });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Track Experiment Error:", error);
    return NextResponse.json(
      { error: "Failed to track experiment" },
      { status: 500 }
    );
  }
}
