import { Doctor } from "../models/doctorModel.js";
import { User } from "../models/user.js";
import { Payment } from "../models/payment.js";

// Aggregated, real platform stats + recent testimonials for the landing page.
export const getStats = async (req, res) => {
  try {
    const [doctorCount, specializations, consultationCount, patientCount, ratingAgg] =
      await Promise.all([
        Doctor.countDocuments(),
        Doctor.distinct("specialization"),
        Payment.countDocuments(),
        User.countDocuments({ role: "patient" }),
        Doctor.aggregate([
          { $match: { numOfReviews: { $gt: 0 } } },
          { $group: { _id: null, avg: { $avg: "$rating" } } },
        ]),
      ]);

    const avgRating = ratingAgg[0]?.avg ? Number(ratingAgg[0].avg.toFixed(1)) : null;

    // Pull a few recent reviews (with comments) across all doctors as testimonials.
    const testimonialDocs = await Doctor.aggregate([
      { $unwind: "$reviews" },
      { $match: { "reviews.comment": { $nin: [null, ""] } } },
      { $sort: { "reviews.createdAt": -1 } },
      { $limit: 6 },
      {
        $project: {
          _id: 0,
          name: "$reviews.name",
          comment: "$reviews.comment",
          rating: "$reviews.rating",
          specialization: "$specialization",
          doctorName: "$name",
        },
      },
    ]);

    res.status(200).json({
      doctors: doctorCount,
      specializations: specializations.length,
      consultations: consultationCount,
      patients: patientCount,
      avgRating,
      testimonials: testimonialDocs,
    });
  } catch (error) {
    console.error("Error building stats:", error);
    res.status(500).json({ message: "Failed to load stats" });
  }
};
