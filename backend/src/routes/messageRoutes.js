import express from "express"
import { allMessages,
    sendMessage,
    } from "../controllers/messageController.js"

    import { isAuthenticatedUser } from "../middlewares/auth.js";

    const router = express.Router();
    router.route("/:chatId").get(isAuthenticatedUser, allMessages);
    router.route("/").post(isAuthenticatedUser, sendMessage);


    
export default router;