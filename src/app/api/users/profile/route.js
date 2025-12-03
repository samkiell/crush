import { NextResponse } from "next/server";
import { protect } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";

export async function GET(req) {
  try {
    const user = await protect(req);
    return NextResponse.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      plan: user.plan,
      examType: user.examType,
      avatar: user.avatar,
      stats: {
        totalQuestions: 0,
        completedExams: 0,
        averageScore: 0,
        weakTopics: [],
      },
    });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 401 });
  }
}

export async function PUT(req) {
  try {
    const user = await protect(req);
    await dbConnect();
    const {
      name,
      email,
      password,
      examType,
      avatar,
      avatarPublicId,
      bio,
      username,
    } = await req.json();

    const updatedUser = await User.findById(user._id);

    if (name) updatedUser.name = name;
    if (email) updatedUser.email = email;
    if (username) updatedUser.username = username;
    if (bio) updatedUser.bio = bio;
    if (examType) updatedUser.examType = examType;
    if (password) updatedUser.password = password;
    if (avatar) updatedUser.avatar = avatar;
    if (avatarPublicId) updatedUser.avatarPublicId = avatarPublicId;

    await updatedUser.save();

    return NextResponse.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      plan: updatedUser.plan,
      examType: updatedUser.examType,
      avatar: updatedUser.avatar,
    });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 401 });
  }
}
