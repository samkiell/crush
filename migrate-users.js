import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./src/lib/models/User.js";

dotenv.config({ path: ".env.local" });

const migrate = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in .env.local");
    }

    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected successfully.");

    // 1. Update 'plan' field
    console.log('Updating missing "plan" fields...');
    const planResult = await User.updateMany(
      { plan: { $exists: false } },
      { $set: { plan: "free" } }
    );
    console.log(
      `Result: ${planResult.matchedCount} matched, ${planResult.modifiedCount} modified.`
    );

    // 2. Update 'username' field
    // Note: Since username is unique, setting all to "" might fail if multiple users are missing it.
    // However, proceeding with updateMany as requested.
    console.log('Updating missing "username" fields...');
    const usernameResult = await User.updateMany(
      { username: { $exists: false } },
      { $set: { username: "" } }
    );
    console.log(
      `Result: ${usernameResult.matchedCount} matched, ${usernameResult.modifiedCount} modified.`
    );

    console.log("Migration completed.");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
};

migrate();
