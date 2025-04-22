import mongoose from "mongoose";

const messageSchema = mongoose.Schema(
  {
    sender: {
      userId: { type: mongoose.Schema.Types.ObjectId, required: true },
      role: { type: String, enum: ["patient", "doctor"], required: true },
    },
    content: { type: String, trim: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    // readBy: [
    //   {
    //     userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    //     userType: { type: String, enum: ["patient", "doctor"], required: true },
    //   }
    // ],
  },
  { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);
