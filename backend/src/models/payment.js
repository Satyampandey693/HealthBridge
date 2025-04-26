import mongoose from "mongoose";

const paymentSchema=new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User"
    },
    doctorId:{
         type: mongoose.Schema.Types.ObjectId, 
        ref: "Doctor"
    },
},
    { timestamps: true }
);


export const Payment=mongoose.model("Payment",paymentSchema);