import express from "express";
import { registerUser,
    loginUser, logoutUser,getUserProfile
} from "../controllers/userAuthController.js";
import { isAuthenticatedUser } from "../middlewares/auth.js";

const router = express.Router();
router.route("/registerUser").post(registerUser);
router.route("/loginUser").post(loginUser);
router.route("/logoutUser").get(logoutUser);


router.route("/me").get(isAuthenticatedUser, getUserProfile);

export default router;