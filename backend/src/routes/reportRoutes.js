import express from 'express';
import upload from '../middlewares/multer.middleware.js';
import {
  uploadReport,
  getReportsByPatient,
  downloadReport,
} from '../controllers/reportController.js';

const router = express.Router();

router.post('/upload', upload.single('report'), uploadReport);
router.get('/patient/:id', getReportsByPatient);
router.get('/download/:filename', downloadReport);

export default router;
