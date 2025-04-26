import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import {Doctor} from "../models/doctorModel.js";
import { User } from "../models/user.js";
// import { getResetPasswordTemplate } from "../utils/emailTemplates.js";
import ErrorHandler from "../utils/errorHandler.js";
// import sendToken from "../utils/sendToken.js";
// import sendEmail from "../utils/sendEmail.js";
// import crypto from "crypto";
// import { delete_file, upload_file } from "../utils/cloudinary.js";

// Register user   =>  /api/v1/register
export const registerUser = catchAsyncErrors(async (req, res, next) => {
  const {name, email,dob,phone_no,city,experience,gender,fee,specialization,password} = req.body;

  const user = await Doctor.create({
    name, email,dob,phone_no,city,gender,experience,fee,specialization,password
  });
  res.status(200).json({
    message:"signup successful",
    token:await user.generateAccessToken(),
    doctorId:user._id.toString(),

  })
  //sendToken(user, 201, res);
});

// Login user   =>  /api/v1/login
export const loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please enter email & password", 400));
  }

  // Find user in the database
  const user = await Doctor.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  // Check if password is correct
  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }
  res.status(200).json({
    message:"login successful",
    token:await user.generateAccessToken(),
    doctorId:user._id.toString(),

  })
  //sendToken(user, 200, res);
});

// Logout user   =>  /api/v1/logout
export const logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    message: "Logged Out",
  });
});


// Upload user avatar   =>  /api/v1/me/upload_avatar
/*export const uploadAvatar = catchAsyncErrors(async (req, res, next) => {
  const avatarResponse = await upload_file(req.body.avatar, "shopit/avatars");

  // Remove previous avatar
  if (req?.user?.avatar?.url) {
    await delete_file(req?.user?.avatar?.public_id);
  }

  const user = await User.findByIdAndUpdate(req?.user?._id, {
    avatar: avatarResponse,
  });

  res.status(200).json({
    user,
  });
});*/

// Forgot password   =>  /api/v1/password/forgot
/*export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  // Find user in the database
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found with this email", 404));
  }

  // Get reset password token
  const resetToken = user.getResetPasswordToken();

  await user.save();

  // Create reset password url
  const resetUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

  const message = getResetPasswordTemplate(user?.name, resetUrl);

  try {
    await sendEmail({
      email: user.email,
      subject: "ShopIT Password Recovery",
      message,
    });

    res.status(200).json({
      message: `Email sent to: ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    return next(new ErrorHandler(error?.message, 500));
  }
});*/

// Reset password   =>  /api/v1/password/reset/:token
/*export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  // Hash the URL Token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Password reset token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Passwords does not match", 400));
  }

  // Set the new password
  user.password = req.body.password;

  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});*/

// Get current user profile  =>  /api/v1/me
export const getUserProfile = catchAsyncErrors(async (req, res, next) => {
  const user = await Doctor.findById(req?.user?._id);

  res.status(200).json({
    user,
  });
});

// Update Password  =>  /api/v1/password/update
/*export const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req?.user?._id).select("+password");

  // Check the previous user password
  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old Password is incorrect", 400));
  }

  user.password = req.body.password;
  user.save();

  res.status(200).json({
    success: true,
  });
});
*/
// Update User Profile  =>  /api/v1/me/update
export const updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  const user = await Doctor.findByIdAndUpdate(req.user._id, newUserData, {
    new: true,
  });

  res.status(200).json({
    user,
  });
});

export const addPatientToDoctor = async (req, res) => {

  const { doctorId, patientId} = req.body;
  console.log(req.body);
  try {
    const user=await User.findById(patientId);
    console.log(user.name);
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    // Check if patient already exists
    console.log("ya");
    // const exists = doctor.patients.find(p => p.patientId === patientId);
    // if (exists) return res.status(400).json({ message: "Patient already added" });

    // Add new patient
    doctor.patients.push({patientId,name:user.name});
    await doctor.save();

    res.status(200).json({ message: "Patient added successfully", patients: doctor.patients });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getPatients = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    res.status(200).json({ patients: doctor.patients });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getDoctorNotifications = async (req, res) => {
  const { doctorId } = req.params;

  try {
    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    //console.log(doctor.notifications);
    res.status(200).json({ notifications: doctor.notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const addDoctorNotification = async (req, res) => {
  const { doctorId } = req.params;
  const { patientId } = req.body;


  try {
    const doctor = await Doctor.findById(doctorId);
    const user=await User.findById(patientId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Prevent duplicates
    // if (doctor.notifications.includes(patientId)) {
    //   return res.status(400).json({ message: 'Notification already exists for this patient' });
    // }

    doctor.notifications.push({patientId,name:user.name});
    console.log(patientId);
    await doctor.save();

    res.status(200).json({ message: 'Notification added successfully', notifications: doctor.notifications });
  } catch (error) {
    console.error('Error adding notification:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const removeDoctorNotification = async (req, res) => {
  const { doctorId,patientId } = req.body;

  try {
    const doctor = await Doctor.findById(doctorId);
    const user = await User.findById(patientId);
    console.log(doctor.name);

    if (!doctor || !user) {
      return res.status(404).json({ message: 'Doctor or patient not found' });
    }

    // Filter out the notification
    doctor.notifications = doctor.notifications.filter(
      (notification) =>
        notification.patientId !== patientId &&
        notification.name !== user.name
    );

    await doctor.save();

    res.status(200).json({ message: 'Notification removed successfully', notifications: doctor.notifications });
  } catch (error) {
    console.error('Error removing notification:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Remove patient from doctor's patients list
export const removePatientFromDoctor = async (req, res) => {
  const { doctorId } = req.params;
  const { patientId } = req.body;

  try {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Filter out the patient from the array
    doctor.patients = doctor.patients.filter(
      (p) => p.toString() !== patientId
    );

    await doctor.save();
    console.log(doctor);

    res.status(200).json({ message: 'Patient removed successfully', patients: doctor.patients });
  } catch (error) {
    console.error('Error removing patient:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const insertAny=async(req,res)=>{

  const {doctorId,patientId}=req.body;
  try{
  const user=await User.findById(patientId);
  const doctor = await Doctor.findById(doctorId);
  doctor.notifications.push({patientId,name:user.name});
  //console.log(doctor.notifications[0].patientId);
  await doctor.save();
  res.status(200).json({ message: 'Notification added successfully', notifications: doctor.notifications });
  }catch(error){
    console.error('Error adding notification:', error);
    res.status(500).json({ message: 'Server error' });
  }
}
export const addSlotToDoctor = async (req, res) => {
  const { doctorId } = req.params;
  const { from, to } = req.body;

  if (!from || !to) {
    return res.status(400).json({ message: 'from, to, and date are required fields.' });
  }

  try {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const newSlot = {
      from,
      to,
      booked: false
    };

    doctor.slots.push(newSlot);
    await doctor.save();

    res.status(200).json({ message: 'Slot added successfully', slots: doctor.slots });
  } catch (error) {
    console.error('Error adding slot:', error);
    res.status(500).json({ message: 'Server error while adding slot' });
  }
};

export const getDoctorDetails = async (req, res) => {
  const { doctorId } = req.params;

  try {
    const doctor = await Doctor.findById(doctorId)
      .select('-password -refreshToken') // Exclude sensitive fields
      .populate('patients.patientId', 'name') // Optional: populate patient names
      .populate('notifications.patientId', 'name'); // Optional: populate notification names

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.status(200).json(doctor);
  } catch (error) {
    console.error('Error fetching doctor details:', error);
    res.status(500).json({ message: 'Server error while fetching doctor details' });
  }
};

export const updateSlotStatusById = async (req, res) => {
  console.log(req.body);
  const { doctorId, slotId, isBooked } = req.body;

  if (!doctorId || !slotId || typeof isBooked !== 'boolean') {
    return res.status(400).json({ message: 'Missing or invalid required fields' });
  }

  try {
    const doctor = await Doctor.findOneAndUpdate(
      {
        _id: doctorId,
        "slots._id": slotId
      },
      {
        $set: { "slots.$.isBooked": isBooked }
      },
      { new: true }
    );

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor or slot not found' });
    }

    res.status(200).json({ message: 'Slot booking status updated successfully', doctor });
  } catch (error) {
    console.error('Error updating slot status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
export const getAllSlots = async (req, res) => {
  const doctorId = req.params.userID;

  try {
    // Find the doctor by ID
    const doctor = await Doctor.findById(doctorId);

    // If doctor not found
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found." });
    }

    // If no slots exist
    if (!doctor.slots || doctor.slots.length === 0) {
      return res.status(404).json({ message: "No slots found for this doctor." });
    }

    // Sort the slots by 'from' time
    const sortedSlots = doctor.slots.sort((a, b) => new Date(a.from) - new Date(b.from));

    return res.status(200).json({ slots: sortedSlots });
  } catch (err) {
    console.error("Error fetching doctor slots:", err);
    return res.status(500).json({ message: "Something went wrong while fetching slots." });
  }
};
