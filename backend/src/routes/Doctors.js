import { search,getDoctors } from "../controllers/Doctors.js";
import express from "express";

const router=express.Router();
router.route("/search").post(search);
router.route("/").get(getDoctors);
export default router;