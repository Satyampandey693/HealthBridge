import Razorpay from "razorpay";

if (!process.env.RAZORPAY_API_KEY || !process.env.RAZORPAY_API_SECRET) {
  console.warn(
    "⚠️  RAZORPAY_API_KEY / RAZORPAY_API_SECRET are not set. Payment features will fail until they are configured in config.env."
  );
}

export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});
