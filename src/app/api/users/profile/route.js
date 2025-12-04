import { NextResponse } from "next/server";
import { protect } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import CbtSession from "@/lib/models/CbtSession";
import dayjs from "dayjs";

export async function GET(req) {
  try {
    const user = await protect(req);
    await dbConnect();

    // Calculate stats from CbtSession
    const sessions = await CbtSession.find({
      userId: user._id,
      status: "submitted",
    });

    const totalQuestions = sessions.reduce(
      (acc, sess) => acc + (sess.summary?.totalQuestions || 0),
      0
    );
    const completedExams = sessions.length;

    let totalScore = 0;
    let totalTimeMs = 0;

    sessions.forEach((sess) => {
      totalScore += sess.summary?.percentage || 0;
      if (sess.startTime && sess.endTime) {
        totalTimeMs += new Date(sess.endTime) - new Date(sess.startTime);
      }
    });

    const averageScore =
      completedExams > 0 ? Math.round(totalScore / completedExams) : 0;
    const timeSpentHours =
      Math.round((totalTimeMs / (1000 * 60 * 60)) * 10) / 10; // 1 decimal place

    // Calculate Streak
    const uniqueDates = [
      ...new Set(
        sessions
          .filter((s) => s.endTime)
          .map((s) => dayjs(s.endTime).format("YYYY-MM-DD"))
      ),
    ]
      .sort()
      .reverse();

    let streak = 0;
    const today = dayjs().format("YYYY-MM-DD");
    const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");

    // Check if user has activity today or yesterday to maintain streak
    if (
      uniqueDates.length > 0 &&
      (uniqueDates[0] === today || uniqueDates[0] === yesterday)
    ) {
      streak = 1;
      let current = dayjs(uniqueDates[0]);

      for (let i = 1; i < uniqueDates.length; i++) {
        const prev = dayjs(uniqueDates[i]);
        if (current.diff(prev, "day") === 1) {
          streak++;
          current = prev;
        } else {
          break;
        }
      }
    }

    return NextResponse.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      plan: user.plan,
      examType: user.examType,
      avatar: user.avatar,
      stats: {
        totalQuestions,
        completedExams,
        averageScore,
        timeSpent: timeSpentHours,
        accuracy: averageScore,
        streak,
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
