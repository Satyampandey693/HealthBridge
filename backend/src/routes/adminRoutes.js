import express from 'express';
import { getAllUsers,getAllDoctors,deleteDoctorById,deleteUserById,updateDoctorById,updateUserById,getDoctorById,getUserById } from '../controllers/admin-controller.js';
import { isAuthenticatedUser,authorizeRoles } from '../middlewares/auth.js';

const router=express.Router();

router.route("/users").get(isAuthenticatedUser,authorizeRoles("admin"),getAllUsers);
router.route("/doctors").get(isAuthenticatedUser,authorizeRoles("admin"),getAllDoctors);
router.route("/user/delete/:id").delete(isAuthenticatedUser,authorizeRoles("admin"),deleteUserById);
router.route("/doctor/delete/:id").delete(isAuthenticatedUser,authorizeRoles("admin"),deleteDoctorById);
router.route("/user/:id").get(isAuthenticatedUser,authorizeRoles("admin"),getUserById);
router.route("/doctor/:id").get(isAuthenticatedUser,authorizeRoles("admin"),getDoctorById);
router.route("/user/update/:id").patch(isAuthenticatedUser,authorizeRoles("admin"),updateUserById);
router.route("/doctor/update/:id").patch(isAuthenticatedUser,authorizeRoles("admin"),updateDoctorById);

export default router;