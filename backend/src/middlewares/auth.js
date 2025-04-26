import catchAsyncErrors from "./catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
import {User} from "../models/user.js";
import { Doctor } from "../models/doctorModel.js";
import jwt from "jsonwebtoken";

// Checks if user is authenticated or not
export const isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No or invalid token provided." });
  }

  const token = authHeader.replace("Bearer ", "").trim();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    let user = await User.findById(decoded.id).select("-password");
    if (!user) {
      user = await Doctor.findById(decoded._id).select("-password");
    }
    if (!user) {
      return res.status(401).json({ message: "User not found with this token." });
    }

    req.user = user;
    req.token = token;
    req.userID = user._id;

    next();
  } catch (error) { 
    console.error("JWT Error:", error.message);
    return res.status(401).json({ message: "Unauthorized. Invalid or expired token." });
  }
});

// Authorize user roles
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role (${req.user.role}) is not allowed to access this resource`,
          403
        )
      );
    }

    next();
  };
};