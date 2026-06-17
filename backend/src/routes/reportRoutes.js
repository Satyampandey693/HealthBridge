import express from 'express';
import upload from '../middlewares/multer.middleware.js';
import { isAuthenticatedUser } from '../middlewares/auth.js';
import {
  uploadReport,
  getReportsByPatient,
  downloadReport,
} from '../controllers/reportController.js';

const router = express.Router();

// Medical reports are sensitive — every route requires a valid session.
router.post('/upload', isAuthenticatedUser, upload.single('report'), uploadReport);
router.get('/patient/:id', isAuthenticatedUser, getReportsByPatient);
router.get('/download/:filename', isAuthenticatedUser, downloadReport);

export default router;
