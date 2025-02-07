import { search } from "../controllers/Doctors.js";
import express from "express";

const router=express.Router();
router.route("/search").get(search);
export default router;