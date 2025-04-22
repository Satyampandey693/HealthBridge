import asyncHandler from "../middlewares/catchAsyncErrors.js";
import { Chat } from "../models/chatModel.js";
import { User } from "../models/user.js";
import { Doctor } from "../models/doctorModel.js";

// Utility function to get user by role
const getUserByRole = async (id, role) => {
  const model = role === "doctor" ? Doctor : User;
  return model.findById(id).select("-password");
};

//@description     Create or fetch One to One Chat
//@route           POST /api/chat/
//@access          Protected
export const accessChat = asyncHandler(async (req, res) => {
  const { userId, role } = req.body;

  if (!userId || !role) {
    return res.status(400).json({ message: "Missing userId or role" });
  }

  let isChat = await Chat.findOne({
    users: {
      $all: [
        { $elemMatch: { userId: req.user._id } },
        { $elemMatch: { userId } },
      ],
    },
  }).populate("latestMessage");

  if (isChat) {
    const populatedUsers = await Promise.all(
      isChat.users.map((u) => getUserByRole(u.userId, u.role))
    );
    isChat = isChat.toObject();
    isChat.users = populatedUsers;
    return res.json(isChat);
  }

  const chatData = {
    chatName: "sender",
    users: [
      { userId: req.user._id, role: req.user.role },
      { userId, role },
    ],
  };

  try {
    const createdChat = await Chat.create(chatData);
    const populatedUsers = await Promise.all(
      createdChat.users.map((u) => getUserByRole(u.userId, u.role))
    );
    const chat = createdChat.toObject();
    chat.users = populatedUsers;
    res.status(200).json(chat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Fetch all chats for a user
//@route           GET /api/chat/
//@access          Protected
export const fetchChats = asyncHandler(async (req, res) => {
  console.log("hi");
  try {
    let chats = await Chat.find({
      users: { $elemMatch: { userId: req.user._id } },
    })
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    const transformedChats = await Promise.all(
      chats.map(async (chat) => {
        const populatedUsers = await Promise.all(
          chat.users.map((u) => getUserByRole(u.userId, u.role))
        );
        chat = chat.toObject();
        chat.users = populatedUsers;
        return chat;
      })
    );

    res.status(200).send(transformedChats);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Delete a chat by ID
//@route           DELETE /api/chat/:chatId
//@access          Protected
export const deleteChat = asyncHandler(async (req, res) => {
  console.log("hifdfd")
  const { chatId } = req.params;

  const chat = await Chat.findById(chatId);

  if (!chat) {
    return res.status(404).json({ message: "Chat not found" });
  }

  // Optional: Verify if the user is a participant in the chat
  const isParticipant = chat.users.some(
    (u) => u.userId.toString() === req.user._id.toString()
  );

  if (!isParticipant) {
    return res.status(403).json({ message: "You are not authorized to delete this chat" });
  }

  await Chat.findByIdAndDelete(chatId);

  // Optional: You might want to delete related messages too
  // await Message.deleteMany({ chat: chatId });

  res.status(200).json({ message: "Chat deleted successfully" });
});
