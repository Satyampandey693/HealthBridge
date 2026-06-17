import asyncHandler from "../middlewares/catchAsyncErrors.js";
import { Notification } from "../models/notificationModel.js";

//@description     Get my (unseen) notifications, newest first
//@route           GET /api/notifications
//@access          Protected
export const getMyNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({
    "recipient.userId": req.user._id,
  })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  // Notifications are deleted once their chat is opened, so every stored
  // notification is effectively unread.
  res.json({ notifications, unreadCount: notifications.length });
});

//@description     Clear notifications once seen (all, or only one chat's)
//@route           POST /api/notifications/clear
//@access          Protected
export const clearNotifications = asyncHandler(async (req, res) => {
  const { chatId } = req.body;
  const filter = { "recipient.userId": req.user._id };
  if (chatId) filter.chatId = chatId;

  const { deletedCount } = await Notification.deleteMany(filter);
  res.json({ success: true, deletedCount });
});
