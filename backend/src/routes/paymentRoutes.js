import {checkout, paymentVerification,checkPaymentStatus, storePayment } from "../controllers/paymentController.js";
import express from "express";
const router=express.Router();
import { isAuthenticatedUser,authorizeRoles } from "../middlewares/auth.js";

router.route("/checkout").post(checkout);
router.route("/verification").post(paymentVerification);
router.route("/store").post(storePayment);
router.route("/status").post(checkPaymentStatus); 

export default router;