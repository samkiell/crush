import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Question from "@/lib/models/Question";
import { authorizeAdmin } from "@/lib/auth";

export async function PUT(req, { params }) {
  try {
    await authorizeAdmin(req);
    await dbConnect();
    const { id } = await params;
    const updates = await req.json();

    const question = await Question.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!question) {
      return NextResponse.json(
        { message: "Question not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(question);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await authorizeAdmin(req);
    await dbConnect();
    const { id } = await params;

    await Question.findByIdAndDelete(id);

    return NextResponse.json({ message: "Question deleted" });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
