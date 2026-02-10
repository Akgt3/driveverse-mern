import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: false,
    },

    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    wishlist: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Listing",
      default: [],
    },

    place: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    avatar: {
      type: String,
    },

    // ✅ STATUS FIELD FOR BLOCKING
    status: {
      type: String,
      enum: ["active", "blocked"],
      default: "active",
    },

    // ❌ REMOVED DUPLICATE ROLE FIELD THAT WAS HERE
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);