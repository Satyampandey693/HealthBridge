import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import { Doctor } from "../models/doctorModel.js";

export const getDoctors = catchAsyncErrors(async (req, res) => {
  const { category } = req.query;

  try {
    let query = {};
    if (category) {
      query.specialization = category;
    }

    const doctors = await Doctor.find(query);
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch doctors" });
  }
});
export const search = catchAsyncErrors(async (req, res, next) => {
  console.log("req.body:", req.body);
  const { name, city } = req.body;

  const filters = {};
  if (name?.trim()) filters.name = { $regex: name.trim(), $options: "i" };
  if (city?.trim()) filters.city = { $regex: city.trim(), $options: "i" };

  if (Object.keys(filters).length === 0) {
    return res.status(400).json({ message: "Please provide at least one search field" });
  }

  try {
    const results = await Doctor.find(filters);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});
