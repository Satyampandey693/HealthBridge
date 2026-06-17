import mongoose from "mongoose";

// A lightweight notification raised when one chat participant messages the
// other. Persisted so the recipient still sees it after a refresh / re-login,
// and surfaced live over Socket.io.
const notificationSchema = mongoose.Schema(
  {
    recipient: {
      userId: { type: mongoose.Schema.Types.ObjectId, required: true },
      role: { type: String, enum: ["patient", "doctor"], required: true },
    },
    sender: {
      userId: { type: mongoose.Schema.Types.ObjectId, required: true },
      name: { type: String },
      role: { type: String, enum: ["patient", "doctor"], required: true },
    },
    type: { type: String, enum: ["message"], default: "message" },
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    content: { type: String, trim: true }, // short preview of the message
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Fetching "my notifications, newest first" is the hot path.
notificationSchema.index({ "recipient.userId": 1, createdAt: -1 });

export const Notification = mongoose.model("Notification", notificationSchema);
