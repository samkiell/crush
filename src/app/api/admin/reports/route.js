import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Report from "@/lib/models/Report";
import { protect } from "@/lib/auth";

export async function GET(req) {
  try {
    const user = await protect(req);
    await dbConnect();

    // Check admin role
    if (user.role !== "admin") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const reports = await Report.find()
      .populate("reporter", "name email")
      .sort({ createdAt: -1 })
      .limit(100);

    return NextResponse.json({ reports });
  } catch (error) {
    console.error("Fetch Reports Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch reports" },
      { status: 500 }
    );
  }
}
