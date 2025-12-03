import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Question from "@/lib/models/Question";
import { authorizeAdmin } from "@/lib/auth";

export async function GET(req) {
  try {
    await authorizeAdmin(req);
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;
    const search = searchParams.get("search") || "";
    const subject = searchParams.get("subject");
    const year = searchParams.get("year");
    const topic = searchParams.get("topic");

    const query = {};

    if (search) {
      query.question = { $regex: search, $options: "i" };
    }
    if (subject) query.subject = subject;
    if (year) query.year = parseInt(year);
    // if (topic) query.topic = topic; // Assuming topic field exists or will be added

    const skip = (page - 1) * limit;

    const questions = await Question.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Question.countDocuments(query);

    return NextResponse.json({
      questions,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await authorizeAdmin(req);
    await dbConnect();

    const { ids } = await req.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ message: "No IDs provided" }, { status: 400 });
    }

    await Question.deleteMany({ _id: { $in: ids } });

    return NextResponse.json({ message: "Questions deleted successfully" });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
