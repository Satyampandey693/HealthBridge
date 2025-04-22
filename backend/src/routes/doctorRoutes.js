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
import { isAuthenticatedUser,authorizeRoles } from "../middlewares/auth.js";
const router = express.Router();

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
router.route("/:doctorId/patients").get(isAuthenticatedUser,authorizeRoles("doctor","admin"),getPatients);
router.route("/add-patient").post(isAuthenticatedUser,authorizeRoles("doctor","admin"),addPatientToDoctor);
router.route('/notifications/:doctorId').get(isAuthenticatedUser,authorizeRoles("doctor","admin"),getDoctorNotifications);
router.route('/add/:doctorId/notifications').post(isAuthenticatedUser,authorizeRoles("doctor","admin"),addDoctorNotification);
router.route('/remove-notification').post(isAuthenticatedUser,authorizeRoles("doctor","admin"),removeDoctorNotification);
router.route('/:doctorId/remove-patient').put(isAuthenticatedUser,authorizeRoles("doctor","admin"),removePatientFromDoctor);
router.route('/add').post(isAuthenticatedUser,authorizeRoles("doctor","admin"),insertAny);
export default router;