import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Report from "@/lib/models/Report";
import { protect } from "@/lib/auth";

export async function PATCH(req, { params }) {
  try {
    const user = await protect(req);
    await dbConnect();

    if (user.role !== "admin") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const { id } = await params;
    const { status } = await req.json();

    const report = await Report.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, report });
  } catch (error) {
    console.error("Update Report Error:", error);
    return NextResponse.json(
      { error: "Failed to update report" },
      { status: 500 }
    );
  }
}
