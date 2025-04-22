import catchAsyncErrors from "./catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
import {User} from "../models/user.js";
import { Doctor } from "../models/doctorModel.js";
import jwt from "jsonwebtoken";

// Checks if user is authenticated or not
export const isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const token  = req.header("authorization");
  if (!token) {
    return res.status(401).json({message:"No token provided"});
  }
  const jwtToken=token.replace("Bearer","").trim();

  //console.log("token from auth middleware",jwtToken);

  try{
    const isVerified=jwt.verify(jwtToken,process.env.JWT_SECRET);

    const userData=await User.findOne({_id:isVerified.id}).select({
      password:0,
    });
    const doctorData=await Doctor.findOne({_id:isVerified.id}).select({
      password:0,
    });
    if(userData){
    req.user=userData;
    req.token=token;
    req.userID=userData._id;
    }
    else if(doctorData){
      req.user=doctorData;
    req.token=token;
    req.userID=doctorData._id;
    }
    
    next();
  }
  catch(error){
    return res.status(401).json({message:"Unauthorized.Invalid token"});
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