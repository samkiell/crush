import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Experiment from "@/lib/models/Experiment";

export async function GET(req) {
  try {
    await dbConnect();
    const experiments = await Experiment.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ experiments });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch experiments" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    const experiment = await Experiment.create(body);

    return NextResponse.json({ experiment }, { status: 201 });
  } catch (error) {
    console.error("Create Experiment Error:", error);
    return NextResponse.json(
      { error: "Failed to create experiment" },
      { status: 500 }
    );
  }
}
