import asyncHandler from "../middlewares/catchAsyncErrors.js";
import { Chat } from "../models/chatModel.js";
import { User } from "../models/user.js";
import { Doctor } from "../models/doctorModel.js";
import { Message } from "../models/messageModel.js";
import { Notification } from "../models/notificationModel.js";

// Helper function to populate user info based on type
const getUserInfo = async (userId, role) => {
  const model = role === "doctor" ? Doctor : User;
  return model.findById(userId).select("name profilePicture email");
};

//@description     Get all Messages
//@route           GET /api/message/:chatId
//@access          Protected
export const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId }).populate("chat");
    const populatedMessages = await Promise.all(
      messages.map(async (msg) => {
        const sender = await getUserInfo(msg.sender.userId, msg.sender.role);
        return {
          ...msg.toObject(),
          sender,
        };
      })
    );
    //console.log(populatedMessages)
    res.json(populatedMessages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Create New Message
//@route           POST /api/message/
//@access          Protected
export const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId,role } = req.body;

  if (!content || !chatId) {
    return res.sendStatus(400);
  }

  const senderRole = req.user.role === "doctor" ? "doctor" : "patient";

  const newMessage = {
    sender: {
      userId: req.user._id,
      role: senderRole,
    },
    content,
    chat: chatId,
   
  };

  try {
    let message = await Message.create(newMessage);
    message = await message.populate("chat");

    const senderInfo = await getUserInfo(message.sender.userId, message.sender.role);

    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

    // Notify the *other* chat participant. The chat is populated, so its
    // users array (each { userId, role }) is available here. A notification
    // failure must never fail the message send, so it's isolated.
    try {
      const recipient = message.chat?.users?.find(
        (u) => String(u.userId) !== String(req.user._id)
      );
      if (recipient) {
        await Notification.create({
          recipient: { userId: recipient.userId, role: recipient.role },
          sender: {
            userId: req.user._id,
            name: senderInfo?.name,
            role: senderRole,
          },
          type: "message",
          chatId,
          content: content.slice(0, 100),
        });
      }
    } catch (notifyErr) {
      console.error("Failed to create message notification:", notifyErr.message);
    }

    res.json({
      ...message.toObject(),
      sender: senderInfo,
      
    });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
