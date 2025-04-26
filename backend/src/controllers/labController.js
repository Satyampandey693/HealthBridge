import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Lab from "../models/Lab.js";



export const getLabsByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const labs = await Lab.find({ category });
    res.json(labs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch labs by category" });
  }
};
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
    const results = await Lab.find(filters);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

export const getLabDetails = async (req, res) => {
  try {
    const labId = req.params.id;
    const lab = await Lab.findById(labId);

    if (!lab) {
      return res.status(404).json({ message: "Lab not found" });
    }

    res.status(200).json({ lab });
  } catch (error) {
    console.error("Error fetching lab details:", error);
    res.status(500).json({ message: "Server Error" });
  }
};



// Create/Update lab review   =>  /api/lab/reviews
export const createdoctorReview = catchAsyncErrors(async (req, res, next) => {
  // console.log("haa bhai")
  const { rating, comment, labId } = req.body;

  const review = {
    user: req?.user?._id,
    rating: Number(rating),
    comment,
  };
  // console.log(review);

  const lab = await Lab.findById(doctorId);

  if (!lab) {
    return next(new ErrorHandler("Lab not found", 404));
  }

  const isReviewed = lab?.reviews?.find(
    (r) => r.user.toString() === req?.user?._id.toString()
  );
  

  if (isReviewed) {
    lab.reviews.forEach((review) => {
      if (review?.user?.toString() === req?.user?._id.toString()) {
        review.comment = comment;
        review.rating = rating;
      }
    });
  } else {
    doctor.reviews.push(review);
    doctor.numOfReviews = doctor.reviews.length;
  }

  doctor.rating =
   doctor.reviews.reduce((acc, item) => item.rating + acc, 0) /
    doctor.reviews.length;

  await doctor.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

// Get doctor reviews   =>  /api/doctors/reviews
export const getdoctorReviews = catchAsyncErrors(async (req, res, next) => {
  // console.log("bhol bhai");
  const doctorId = req.query.id;
  // console.log("yes hai dc Id",doctorId);
const doctor = await Doctor.findById(doctorId).populate("reviews.user");

  // const doctor = await Doctor.findById(req.query.id).populate("reviews.user");
  // console.log(doctor)
;
  if (!doctor) {
    return next(new ErrorHandler("Doctor not found", 404));
  }

  res.status(200).json({
    reviews: doctor.reviews,
  });
});
