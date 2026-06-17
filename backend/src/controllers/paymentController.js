import { instance } from "../../config/paymentClient.js";
import crypto from "crypto";
import { Payment } from "../models/payment.js";
import { Doctor } from "../models/doctorModel.js";

// Create a Razorpay order. The amount is derived from the doctor's fee on the
// server — never trusted from the client — so a patient cannot pay an arbitrary
// (e.g. ₹1) amount.
export const checkout = async (req, res) => {
  try {
    const { doctorId } = req.body;
    if (!doctorId) {
      return res.status(400).json({ success: false, message: "doctorId is required" });
    }

    const doctor = await Doctor.findById(doctorId).select("fee");
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    const amount = Math.round(Number(doctor.fee) * 100); // paise

    const order = await instance.orders.create({
      amount,
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
      payment_capture: 1,
    });

    res.status(200).json({ order });
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    res.status(500).json({ success: false, message: "Order creation failed" });
  }
};

// Verify the Razorpay signature. Only on a valid signature do we persist the
// payment — and we tie it to the authenticated user, not a client-supplied id.
export const paymentVerification = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, doctorId } = req.body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !doctorId) {
      return res.status(400).json({ success: false, message: "Missing payment fields" });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
      .update(body)
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;
    if (!isAuthentic) {
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

    // Idempotent: one access record per (patient, doctor) pair.
    await Payment.findOneAndUpdate(
      { userId: req.user._id, doctorId },
      { userId: req.user._id, doctorId, razorpay_payment_id, razorpay_order_id },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Payment verification failed:", error);
    res.status(500).json({ success: false, message: "Payment verification failed" });
  }
};

// Backwards-compatible explicit store. Identity always comes from the token,
// and writes are idempotent so it can't create duplicates or spoof another user.
export const storePayment = async (req, res) => {
  try {
    const { doctorId } = req.body;
    if (!doctorId) {
      return res.status(400).json({ message: "doctorId is required" });
    }

    const payment = await Payment.findOneAndUpdate(
      { userId: req.user._id, doctorId },
      { userId: req.user._id, doctorId },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.status(201).json({ message: "Payment stored", payment });
  } catch (err) {
    console.error("Error storing payment:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Whether the authenticated patient already has access to this doctor's chat.
export const checkPaymentStatus = async (req, res) => {
  try {
    const { doctorId } = req.body;
    if (!doctorId) {
      return res.status(400).json({ allowed: false, message: "Missing doctorId" });
    }

    const paymentExists = await Payment.findOne({ userId: req.user._id, doctorId });
    return res.status(200).json({ allowed: !!paymentExists });
  } catch (error) {
    console.error("Payment status check failed:", error);
    return res.status(500).json({ allowed: false, message: "Internal server error" });
  }
};
