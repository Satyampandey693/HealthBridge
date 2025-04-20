import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import {User} from "../models/user.js";
import ErrorHandler from "../utils/errorHandler.js";
import sendToken from "../utils/sendToken.js";
import crypto from "crypto";


// Register user   =>  /api/registerUser
export const registerUser = catchAsyncErrors(async (req, res, next) => {
  
    const { name, email,phone,age, password } = req.body;
  
    const user = await User.create({
      name,
      email,
      phone,
      age,
      password,
    });
  
    //sendToken(user, 201, res);
    res.status(200).json({
      message:"registration successful",
      userId:user._id,
      token:user.getJwtToken()
    });
  });

  // Login user   =>  /api/login
export const loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return next(new ErrorHandler("Please enter email & password", 400));
    }
  
    // Find user in the database
    const user = await User.findOne({ email }).select("+password");
  
    if (!user) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }
  
    // Check if password is correct
    const isPasswordMatched = await user.comparePassword(password);
  
    if (!isPasswordMatched) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }
  
    //sendToken(user, 200, res);
    res.status(200).json({
      message:"login successful",
      userId:user._id,
      token:user.getJwtToken()
    })
  });
  
  // Logout user   =>  /api/logout
  export const logoutUser = catchAsyncErrors(async (req, res, next) => {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
  
    res.status(200).json({
      message: "Logged Out",
    });
  });

  // Get current user profile  =>  /api/me
export const getUserProfile = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req?.user?._id);
  
    res.status(200).json({
      user,
    });
  });
  