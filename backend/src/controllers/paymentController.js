import { instance } from "../../config/paymentClient.js"; 
import crypto from "crypto";

export const checkout = async (req, res) => {
    try {

      const amount = Math.round(Number(req.body.amount) * 100);
  
      console.log("Creating Razorpay order for amount:", amount);
  
      const options = {
        amount: amount/1000,
        currency: "INR",
        receipt: `receipt_order_${Date.now()}`,
        payment_capture: 1,
      };

      console.log(instance.orders);

      const order = await instance.orders.create(options);
  
      console.log("Order created successfully:", order);
  
      res.status(200).json({ order });
  
    } catch (error) {
      console.error("❌ Razorpay Order Creation Error:", error);
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
        res.status(200).json({
            success:true,
        });
    }
    else{
    res.status(400).json({
        success:false,
    });
}
}