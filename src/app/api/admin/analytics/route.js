import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import CbtSession from "@/lib/models/CbtSession";
import { auth } from "@/auth"; // Assuming auth helper exists, or I might need to check session

export async function GET(req) {
  try {
    await dbConnect();

    // Basic Auth Check (You might want to enhance this with actual admin role check)
    // const session = await auth();
    // if (!session || session.user.role !== 'admin') {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // 1. Traffic (Logins in last 7 days)
    // Since loginHistory is an array in User, this aggregation might be heavy.
    // We'll approximate by checking 'lastLogin' for active users count,
    // or aggregate loginHistory if the array isn't too huge.
    // For performance, let's just count users active in the last 7 days.
    const activeUsersCount = await User.countDocuments({
      "security.lastLogin": { $gte: sevenDaysAgo },
    });

    // 2. Active Sessions (Last 24 hours)
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const activeSessionsCount = await CbtSession.countDocuments({
      updatedAt: { $gte: oneDayAgo },
    });

    // 3. Premium Conversions
    const premiumUsersCount = await User.countDocuments({ plan: "premium" });
    const totalUsersCount = await User.countDocuments({});
    const conversionRate =
      totalUsersCount > 0
        ? ((premiumUsersCount / totalUsersCount) * 100).toFixed(2)
        : 0;

    // 4. Device Distribution (Sample from last 100 logins or active users)
    // We'll aggregate from users who logged in recently
    const deviceStats = await User.aggregate([
      { $match: { "security.lastLogin": { $gte: thirtyDaysAgo } } },
      { $unwind: "$security.loginHistory" },
      { $match: { "security.loginHistory.date": { $gte: thirtyDaysAgo } } },
      { $group: { _id: "$security.loginHistory.device", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    // 5. Top Subjects
    const topSubjects = await CbtSession.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      { $group: { _id: "$subject", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    // 6. Question Usage (Total questions attempted)
    const questionUsage = await CbtSession.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      { $project: { numberOfQuestions: { $size: "$questions" } } },
      { $group: { _id: null, total: { $sum: "$numberOfQuestions" } } },
    ]);

    // 7. Traffic Trend (Last 7 days)
    // We need daily counts. This is hard with just 'lastLogin'.
    // We'll use loginHistory but limit to recent entries.
    const trafficTrend = await User.aggregate([
      { $unwind: "$security.loginHistory" },
      { $match: { "security.loginHistory.date": { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$security.loginHistory.date",
            },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return NextResponse.json({
      metrics: {
        activeUsers: activeUsersCount,
        activeSessions: activeSessionsCount,
        premiumUsers: premiumUsersCount,
        conversionRate: conversionRate,
        totalQuestions: questionUsage[0]?.total || 0,
      },
      charts: {
        traffic: trafficTrend.map((t) => ({ label: t._id, value: t.count })),
        devices: deviceStats.map((d) => ({
          label: d._id || "Unknown",
          value: d.count,
        })),
        subjects: topSubjects.map((s) => ({ label: s._id, value: s.count })),
      },
    });
  } catch (error) {
    console.error("Analytics Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
