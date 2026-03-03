import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Notification from "@/lib/models/Notification";
import { protect, authorizeAdmin } from "@/lib/auth";

// GET: Fetch notifications for the current user
export async function GET(req) {
  try {
    const user = await protect(req);
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit")) || 20;
    const page = parseInt(searchParams.get("page")) || 1;
    const skip = (page - 1) * limit;

    // Fetch notifications where:
    // 1. Recipient is the current user
    // 2. Recipient is null (Global)
    const query = {
      $or: [{ recipient: user._id }, { recipient: null }],
    };

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Add "isRead" flag for global notifications
    const processedNotifications = notifications.map((notif) => {
      if (!notif.recipient) {
        // It's global, check if user ID is in readBy array
        const hasRead =
          notif.readBy &&
          notif.readBy.some((id) => id.toString() === user._id.toString());
        return { ...notif, isRead: hasRead };
      }
      return notif;
    });

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({
      recipient: user._id,
      isRead: false,
    });

    // For global unread, it's harder to count efficiently without aggregation,
    // but for now we'll stick to direct recipient unread or do a separate check if needed.
    // A simple approximation for global unread:
    const globalUnread = await Notification.countDocuments({
      recipient: null,
      readBy: { $ne: user._id },
    });

    return NextResponse.json({
      success: true,
      data: processedNotifications,
      meta: {
        total,
        unread: unreadCount + globalUnread,
        page,
        limit,
      },
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

// POST: Create a notification (Admin or System internal use)
export async function POST(req) {
  try {
    // Only admins can manually trigger this endpoint for now
    // System calls should use the model directly
    const user = await authorizeAdmin(req);
    await dbConnect();

    const body = await req.json();
    const { recipientId, title, message, link, type } = body;

    const notification = await Notification.create({
      recipient: recipientId || null, // null = global
      title,
      message,
      link,
      type: type || "system",
      data: { senderId: user._id },
    });

    // Broadcast via Socket.io
    if (global.io) {
      if (notification.recipient) {
        // Emit to specific user room if we had one, or just general event with recipient check on client
        // Ideally: global.io.to(`user:${recipientId}`).emit('notification:new', notification);
        // But since we don't have user rooms set up explicitly in the socket file I saw earlier,
        // we'll broadcast and let client filter, OR we rely on the client joining a room.
        // Let's assume we emit a general event and client filters.
        global.io.emit("notification:new", notification);
      } else {
        // Global broadcast
        global.io.emit("notification:new", notification);
      }
    }

    return NextResponse.json(
      { success: true, data: notification },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error sending notification:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to send notification" },
      { status: 500 }
    );
  }
}

// PUT: Mark as read
export async function PUT(req) {
  try {
    const user = await protect(req);
    await dbConnect();

    const body = await req.json();
    const { notificationId, markAll } = body;

    if (markAll) {
      // Mark all unread notifications for this user as read
      // 1. Update personal notifications
      await Notification.updateMany(
        { recipient: user._id, isRead: false },
        { $set: { isRead: true } }
      );

      // 2. Update global notifications (add user to readBy)
      // We need to find global notifications where user is NOT in readBy
      await Notification.updateMany(
        { recipient: null, readBy: { $ne: user._id } },
        { $addToSet: { readBy: user._id } }
      );

      return NextResponse.json({ success: true });
    }

    if (!notificationId) {
      return NextResponse.json(
        { success: false, error: "ID required" },
        { status: 400 }
      );
    }

    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return NextResponse.json(
        { success: false, error: "Not found" },
        { status: 404 }
      );
    }

    if (notification.recipient) {
      // Personal notification
      if (notification.recipient.toString() !== user._id.toString()) {
        return NextResponse.json(
          { success: false, error: "Unauthorized" },
          { status: 403 }
        );
      }
      notification.isRead = true;
      await notification.save();
    } else {
      // Global notification
      // Add user to readBy if not already there
      await Notification.findByIdAndUpdate(notificationId, {
        $addToSet: { readBy: user._id },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating notification:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update notification" },
      { status: 500 }
    );
  }
}
