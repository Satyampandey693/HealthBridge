import { checkout, paymentVerification } from "../controllers/paymentController.js";
import express from "express";
const router=express.Router();
import { isAuthenticatedUser,authorizeRoles } from "../middlewares/auth.js";

router.route("/checkout").post(checkout);
router.route("/paymentverification").post(paymentVerification);

export default router;