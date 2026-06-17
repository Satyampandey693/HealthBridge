import express from "express";
import { isAuthenticatedUser } from "../middlewares/auth.js";
import {
  getMyNotifications,
  clearNotifications,
} from "../controllers/notificationController.js";

const router = express.Router();

// Every route is per-user, so authentication is required.
router.get("/", isAuthenticatedUser, getMyNotifications);
router.post("/clear", isAuthenticatedUser, clearNotifications);

export default router;
