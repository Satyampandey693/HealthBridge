import express from "express";
import { registerUser,
    loginUser, logoutUser,getUserProfile
} from "../controllers/userAuthController.js";
import { isAuthenticatedUser,authorizeRoles } from "../middlewares/auth.js";

const router = express.Router();
router.route("/registerUser").post(registerUser);
router.route("/loginUser").post(loginUser);
router.route("/logoutUser").get(logoutUser);


router.route("/me").get(isAuthenticatedUser,authorizeRoles("patient","admin"),getUserProfile);

export default router;