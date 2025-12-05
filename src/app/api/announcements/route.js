import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Announcement from "@/lib/models/Announcement";
import { authorizeAdmin } from "@/lib/auth";

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    const announcements = await Announcement.find({ isActive: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("createdBy", "name avatar");

    const total = await Announcement.countDocuments({ isActive: true });

    return NextResponse.json({
      success: true,
      data: announcements,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch announcements" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    // 1. Authorize Admin
    const user = await authorizeAdmin(req);

    // 2. Parse Body
    const body = await req.json();
    const { title, message, link, category } = body;

    if (!title || !message) {
      return NextResponse.json(
        { success: false, error: "Title and message are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // 3. Create Announcement
    const announcement = await Announcement.create({
      title,
      message,
      link,
      category,
      createdBy: user._id,
    });

    // 4. Broadcast via Socket.io
    if (global.io) {
      global.io.emit("announcement:new", {
        ...announcement.toObject(),
        createdBy: {
          _id: user._id,
          name: user.name,
          avatar: user.avatar,
        },
      });
    } else {
      console.warn("Socket.io instance not found in global scope");
    }

    return NextResponse.json(
      { success: true, data: announcement },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating announcement:", error);
    const status = error.message.includes("Not authorized") ? 401 : 500;
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create announcement",
      },
      { status }
    );
  }
}
