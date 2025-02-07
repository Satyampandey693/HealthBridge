import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import { Doctor } from "../models/doctorModel.js";
export const search=catchAsyncErrors(async(req,res,next)=>{
  const { name, city } = req.query;

  try {
      const filters = {};
      if (name) filters.name = { $regex: name, $options: "i" };
      if (city) filters.city = { $regex: city, $options: "i" };

      const results = await Doctor.find(filters);

      res.json(results);
  } catch (error) {
      res.status(500).json({ message: "Server Error" });
  }
});