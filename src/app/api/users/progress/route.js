import { NextResponse } from "next/server";
import { protect } from "@/lib/auth";
import dbConnect from "@/lib/db";
import CbtSession from "@/lib/models/CbtSession";
import dayjs from "dayjs";

export async function GET(req) {
  try {
    const user = await protect(req);
    await dbConnect();

    // Calculate start of 7 days ago
    const sevenDaysAgo = dayjs().subtract(6, "day").startOf("day");

    // Fetch sessions from the last 7 days
    const sessions = await CbtSession.find({
      userId: user._id,
      endTime: { $gte: sevenDaysAgo.toDate() },
      status: "submitted",
    });

    // Initialize weekly activity map
    const activityMap = {};
    for (let i = 0; i < 7; i++) {
      const date = dayjs().subtract(i, "day").format("YYYY-MM-DD");
      activityMap[date] = 0;
    }

    // Aggregate duration (in minutes)
    sessions.forEach((session) => {
      if (session.startTime && session.endTime) {
        const date = dayjs(session.endTime).format("YYYY-MM-DD");
        // Only count if within our map (double check, though query should handle it)
        if (activityMap[date] !== undefined) {
          const durationMs =
            new Date(session.endTime) - new Date(session.startTime);
          const durationMin = Math.round(durationMs / 60000);
          activityMap[date] += durationMin;
        }
      }
    });

    // Format for frontend: array of { day: 'M', val: 10 }
    // Chronological order (7 days ago -> Today)
    const weeklyActivity = [];
    for (let i = 6; i >= 0; i--) {
      const d = dayjs().subtract(i, "day");
      const dateKey = d.format("YYYY-MM-DD");
      weeklyActivity.push({
        day: d.format("dd").charAt(0), // 'S', 'M', 'T'...
        val: activityMap[dateKey] || 0,
      });
    }

    return NextResponse.json({
      weeklyActivity,
    });
  } catch (error) {
    console.error("Progress API Error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
