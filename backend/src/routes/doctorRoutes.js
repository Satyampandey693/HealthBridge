import express from "express";
import {
  getUserProfile,
  loginUser,
  logout,
  registerUser,
  updateProfile,
  getPatients,
  addPatientToDoctor,
  getDoctorNotifications,
  addDoctorNotification,
  insertAny,
  removeDoctorNotification,
  removePatientFromDoctor
} from "../controllers/docController.js";
const router = express.Router();

import { authorizeRoles, isAuthenticatedUser } from "../middlewares/auth.js";

router.route("/signup").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logout);

// router.route("/password/forgot").post(forgotPassword);
// router.route("/password/reset/:token").put(resetPassword);

router.route("/me").get(isAuthenticatedUser, getUserProfile);
router.route("/me/update").put(isAuthenticatedUser, updateProfile);
// router.route("/password/update").put(isAuthenticatedUser, updatePassword);
// router.route("/me/upload_avatar").put(isAuthenticatedUser, uploadAvatar);

// router
//   .route("/admin/users")
//   .get(isAuthenticatedUser, authorizeRoles("admin"), allUsers);

// router
//   .route("/admin/users/:id")
//   .get(isAuthenticatedUser, authorizeRoles("admin"), getUserDetails)
//   .put(isAuthenticatedUser, authorizeRoles("admin"), updateUser)
//   .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);
router.get("/:doctorId/patients", getPatients);
router.post("/add-patient", addPatientToDoctor);
router.get('/notifications/:doctorId',getDoctorNotifications);
router.post('/add/:doctorId/notifications', addDoctorNotification);
router.post('/remove-notification',removeDoctorNotification);
router.put('/:doctorId/remove-patient', removePatientFromDoctor);
router.post('/add', insertAny);
export default router;