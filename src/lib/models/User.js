import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
    maxlength: [60, "Name cannot be more than 60 characters"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please provide a valid email",
    ],
  },
  username: {
    type: String,
    required: [true, "Please provide a username"],
    unique: true,
    trim: true,
    minlength: [3, "Username must be at least 3 characters"],
    maxlength: [20, "Username cannot be more than 20 characters"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: [6, "Password must be at least 6 characters"],
    select: false, // Don't return password by default
  },
  role: {
    type: String,
    enum: ["student", "admin", "tutor"],
    default: "student",
  },
  plan: {
    type: String,
    enum: ["free", "premium"],
    default: "free",
  },
  isSuspended: {
    type: Boolean,
    default: false,
  },
  phone: {
    type: String,
    trim: true,
  },
  bio: {
    type: String,
    maxlength: [160, "Bio cannot be more than 160 characters"],
    default: "",
  },
  preferences: {
    theme: {
      type: String,
      enum: ["light", "dark", "eye-care"],
      default: "light",
    },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      marketing: { type: Boolean, default: false },
    },
    language: {
      type: String,
      default: "en",
    },
  },
  security: {
    lastLogin: { type: Date },
    loginHistory: [
      {
        ip: String,
        device: String,
        date: { type: Date, default: Date.now },
      },
    ],
  },
  examType: {
    type: String,
    enum: ["JAMB", "WAEC", "NECO", "PUTME", "DE"],
    default: "JAMB",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // Community Fields
  badges: [
    {
      type: String, // e.g., 'Rising Scholar', 'Mentor'
    },
  ],
  reputation: {
    type: Number,
    default: 0,
  },
  avatar: {
    type: String, // URL to avatar image
    default: "",
  },
  avatarPublicId: {
    type: String,
    default: "",
  },
  bookmarks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CommunityPost",
    },
  ],
});

// Encrypt password using bcrypt
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.models.User || mongoose.model("User", UserSchema);
