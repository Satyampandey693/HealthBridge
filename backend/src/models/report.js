import mongoose from "mongoose";

const reportSchema=new mongoose.Schema({
  doctorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Doctor', 
    required: true 
},
  patientId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true
 },
  filePath: { 
    type: String, 
    required: true 
},
  fileName: { 
    type: String, 
    required: true 
},
  uploadedAt: { 
    type: Date, 
    default: Date.now 
},
});

export const Report=mongoose.model("Report",reportSchema);