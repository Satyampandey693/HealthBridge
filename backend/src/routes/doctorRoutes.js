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
  removePatientFromDoctor,
  addSlotToDoctor,
  getDoctorDetails,
  updateSlotStatusById,
  getAllSlots,
  createDoctorReview,
  uploadDoctorAvatar
} from "../controllers/docController.js";
import { isAuthenticatedUser,authorizeRoles } from "../middlewares/auth.js";
import { avatarUpload } from "../middlewares/avatarUpload.middleware.js";
const router = express.Router();

router.route("/signup").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logout);

// router.route("/password/forgot").post(forgotPassword);
// router.route("/password/reset/:token").put(resetPassword);

router.route("/me").get(isAuthenticatedUser, getUserProfile);
router.route("/me/update").put(isAuthenticatedUser, updateProfile);
router.route("/me/avatar").put(isAuthenticatedUser, authorizeRoles("doctor"), avatarUpload.single("avatar"), uploadDoctorAvatar);
// router.route("/password/update").put(isAuthenticatedUser, updatePassword);
// router.route("/me/upload_avatar").put(isAuthenticatedUser, uploadAvatar);

// router
//   .route("/admin/users")
//   .get(isAuthenticatedUser, authorizeRoles("admin"), allUsers);

// router
//   .route("/admin/users/:id")
//   .get(isAuthenticatedUser, authorizeRoles("admin"), getUserDetails)
//   .put(isAuthenticatedUser, authorizeR oles("admin"), updateUser)
//   .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);
router.route("/:doctorId/patients").get(isAuthenticatedUser,authorizeRoles("doctor","admin"),getPatients);
router.route("/add-patient").post(isAuthenticatedUser,authorizeRoles("doctor","admin"),addPatientToDoctor);
router.route('/notifications/:doctorId').get(isAuthenticatedUser,authorizeRoles("doctor","admin"),getDoctorNotifications);
router.route('/add/:doctorId/notifications').post(isAuthenticatedUser,authorizeRoles("patient","admin"),addDoctorNotification);
router.route('/remove-notification').post(isAuthenticatedUser,authorizeRoles("doctor","admin"),removeDoctorNotification);
router.route('/:doctorId/remove-patient').put(isAuthenticatedUser,authorizeRoles("doctor","admin"),removePatientFromDoctor);
router.route('/add').post(isAuthenticatedUser,authorizeRoles("doctor","admin"),insertAny);
router.route('/add/:doctorId').post(isAuthenticatedUser,authorizeRoles("doctor","admin"),addSlotToDoctor);
router.route('/:doctorId/review').post(isAuthenticatedUser,authorizeRoles("patient"),createDoctorReview);
router.route('/:doctorId').get(isAuthenticatedUser,authorizeRoles("patient","admin"),getDoctorDetails);
router.route('/slot/update').put(isAuthenticatedUser,authorizeRoles("admin","doctor","patient"),updateSlotStatusById);
router.route("/slots/:userID").get(isAuthenticatedUser,getAllSlots);
export default router;