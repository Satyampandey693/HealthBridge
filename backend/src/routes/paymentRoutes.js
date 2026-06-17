import express from "express";
import {
  checkout,
  paymentVerification,
  checkPaymentStatus,
  storePayment,
} from "../controllers/paymentController.js";
import { isAuthenticatedUser } from "../middlewares/auth.js";

const router = express.Router();

router.route("/checkout").post(isAuthenticatedUser, checkout);
router.route("/verification").post(isAuthenticatedUser, paymentVerification);
router.route("/store").post(isAuthenticatedUser, storePayment);
router.route("/status").post(isAuthenticatedUser, checkPaymentStatus);

export default router;
