import { instance } from "../../config/paymentClient.js"; 
import crypto from "crypto";
import { Payment } from "../models/payment.js";

export const checkout = async (req, res) => {
    try {
      const amount = Math.round(Number(req.body.amount) * 100);
      console.log(amount);
  
      const options = {
        amount: amount,
        currency: "INR",
        receipt: `receipt_order_${Date.now()}`,
        payment_capture: 1,
      };

      const order = await instance.orders.create(options);
  
      res.status(200).json({ order });
  
    } catch (error) {
      console.error(" Razorpay Order Creation Error:", error);
      res.status(500).json({ success: false, message: "Order creation failed", error });
    }
  };
  

export const paymentVerification=async(req,res)=>{
  
    const {razorpay_payment_id,razorpay_order_id,razorpay_signature}=req.body;
    const body=razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature=crypto.createHmac("sha256",process.env.RAZORPAY_API_SECRET)
    .update(body.toString())
    .digest("hex");
    console.log("sig received",razorpay_signature);
    console.log("sig generated",expectedSignature);

    const isAuthentic=expectedSignature===razorpay_signature;

    if(isAuthentic){
      console.log("authentic");
        res.status(200).json({
            success:true,
        });
    }
    else{
      console.log("not authentic");
    res.status(400).json({
        success:false,
    });
}
}

export const storePayment = async (req, res) => {
  try {
    const { userId, doctorId} = req.body;

    if (!userId || !doctorId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const payment = await Payment.create({
      userId,
      doctorId,
      createdAt: new Date(),
    });

    return res.status(201).json({ message: "Payment stored", payment });
  } catch (err) {
    console.error("Error storing payment:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const checkPaymentStatus = async (req, res) => {
  try {
    const { userId, doctorId } = req.body;
    console.log("hello",req.body);

    if (!userId || !doctorId) {
      return res.status(400).json({ allowed: false, message: "Missing userId or doctorId" });
    }

    const paymentExists = await Payment.findOne({ userId, doctorId });

    if (paymentExists) {
      return res.status(200).json({ allowed: true });
    } else {
      return res.status(200).json({ allowed: false });
    }
  } catch (error) {
    console.error("Payment status check failed:", error);
    return res.status(500).json({ allowed: false, message: "Internal server error" });
  }
};