import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });

import User from "../lib/models/User.js";

async function makeAdminPremium() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Find admin user(s)
    const admins = await User.find({ role: "admin" });

    if (admins.length === 0) {
      console.log("No admin users found.");
      // Optional: Create one? No, user said "make it that admin should have..." implying one exists or they log in as one.
      // But if none exists, I can't update.
    } else {
      for (const admin of admins) {
        admin.plan = "premium";
        await admin.save();
        console.log(`Updated admin ${admin.email} to premium.`);
      }
    }

    // Also update any user with username 'admin' just in case
    const userAdmin = await User.findOne({ username: "admin" });
    if (userAdmin && userAdmin.role !== "admin") {
      // If there is a user named admin but not role admin, maybe update them too?
      // The prompt says "admin should have a premium account".
      // I'll stick to role='admin'.
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
  }
}

makeAdminPremium();
