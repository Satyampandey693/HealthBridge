import express from "express";
import { registerUser,
    loginUser, logoutUser,getUserProfile, uploadUserAvatar
} from "../controllers/userAuthController.js";
import { isAuthenticatedUser,authorizeRoles } from "../middlewares/auth.js";
import { avatarUpload } from "../middlewares/avatarUpload.middleware.js";

const router = express.Router();
router.route("/registerUser").post(registerUser);
router.route("/loginUser").post(loginUser);
router.route("/logoutUser").get(logoutUser);


router.route("/me").get(isAuthenticatedUser,authorizeRoles("patient","admin"),getUserProfile);
router.route("/me/avatar").put(isAuthenticatedUser,authorizeRoles("patient","admin"),avatarUpload.single("avatar"),uploadUserAvatar);

export default router;