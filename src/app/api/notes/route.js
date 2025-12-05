import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Note from "@/lib/models/Note";
import { protect } from "@/lib/auth";

export async function GET(req) {
  try {
    await dbConnect();
    const user = await protect(req);

    const { searchParams } = new URL(req.url);
    const questionId = searchParams.get("questionId");
    const subject = searchParams.get("subject");

    let query = { userId: user._id };
    if (questionId) query.questionId = questionId;
    if (subject) query.subject = subject;

    const notes = await Note.find(query).sort({ updatedAt: -1 });

    return NextResponse.json({
      success: true,
      count: notes.length,
      data: notes,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || "Server Error" },
      { status: error.message.includes("Not authorized") ? 401 : 500 }
    );
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const user = await protect(req);
    const body = await req.json();

    const { questionId, subject, content, _id } = body;
    const mongoose = require('mongoose');

    let note;
    const isValidObjectId = mongoose.Types.ObjectId.isValid(_id);

    if (_id && isValidObjectId) {
      // Try to update existing note
      note = await Note.findOneAndUpdate(
        { _id, userId: user._id },
        { content, subject, questionId },
        { new: true, runValidators: true }
      );
    }

    // If no valid ID provided or update failed (note not found), create new
    if (!note) {
      note = await Note.create({
        userId: user._id,
        questionId,
        subject,
        content,
      });
    }

    return NextResponse.json({ success: true, data: note });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || "Server Error" },
      { status: error.message.includes("Not authorized") ? 401 : 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    await dbConnect();
    const user = await protect(req);
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Note ID is required" },
        { status: 400 }
      );
    }

    const note = await Note.findOneAndDelete({ _id: id, userId: user._id });

    if (!note) {
      return NextResponse.json(
        { success: false, error: "Note not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || "Server Error" },
      { status: error.message.includes("Not authorized") ? 401 : 500 }
    );
  }
}
