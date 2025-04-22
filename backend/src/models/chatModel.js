import mongoose from "mongoose";

const chatModel = mongoose.Schema(
  {
    chatName: { type: String, trim: true },
    users: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, required: true },
        role: { type: String, enum: ["patient", "Doctor"], required: true },
      }
    ],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  { timestamps: true }
);

export const Chat = mongoose.model("Chat", chatModel);
