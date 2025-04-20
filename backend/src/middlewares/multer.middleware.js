import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import dotenv from "dotenv";
dotenv.config();

const match = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "application/pdf",
  "text/plain",
  "application/json",
  "application/zip",
  "application/msword", // .doc
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "application/vnd.ms-excel", // .xls
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
  "audio/mpeg", // MP3
  "video/mp4", // MP4 videos
];

const url = 'mongodb://localhost:27017/HealthBridge';

const storage = new GridFsStorage({
  url,
  file: (req, file) =>
    new Promise((resolve, reject) => {
      if (!match.includes(file.mimetype)) {
        return reject(new Error("Unsupported file type"));
      }

      const doctorId = req.query.doctorId;  // Now accessing from body
      const patientId = req.query.patientId; // Now accessing from body

      if (!doctorId || !patientId) {
        return reject(new Error("Missing doctorId or patientId"));
      }

      const fileInfo = {
        bucketName: "reports",
        filename: `${Date.now()}-file-${file.originalname}`,
        metadata: {
          doctorId,
          patientId,
          originalName: file.originalname,
        },
      };
      console.log("File metadata prepared:", fileInfo);
      resolve(fileInfo);
    }),
});

const upload = multer({ storage });

export default upload;
