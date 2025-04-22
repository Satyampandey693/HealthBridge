import express from "express"
import {accessChat,
    fetchChats,deleteChat
    
    } from "../controllers/chatControllers.js"

    import { isAuthenticatedUser } from "../middlewares/auth.js";

    const router = express.Router();
    router.route("/").post(isAuthenticatedUser,accessChat);
    
    router.route("/").get( isAuthenticatedUser,fetchChats);

    router.route("/:chatId").delete( isAuthenticatedUser,deleteChat);

    
export default router;