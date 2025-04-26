import express from "express";
import { search, getLabsByCategory, getdoctorReviews, createdoctorReview } from "../controllers/labController.js";
import { isAuthenticatedUser } from "../middlewares/auth.js";
import { getLabDetails } from "../controllers/labController.js";

const router = express.Router();

router.post("/search",search);
router.get("/category", getLabsByCategory);
router.get("/details/:id", getLabDetails);
router
  .route("/reviews")
  .get(isAuthenticatedUser, getdoctorReviews)
  .put(isAuthenticatedUser, createdoctorReview);

export default router;
