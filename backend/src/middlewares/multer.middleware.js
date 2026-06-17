import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import { getMongoURI } from "../../config/dbConnect.js";

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

const storage = new GridFsStorage({
  url: getMongoURI(),
  file: (req, file) =>
    new Promise((resolve, reject) => {
      if (!match.includes(file.mimetype)) {
        return reject(new Error("Unsupported file type"));
      }

      const doctorId = req.query.doctorId;  // Now accessing from body
      const patientId = req.query.patientId; // Now accessing from body
      const description = (req.query.description || "").trim();

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
          description,
        },
      };
      resolve(fileInfo);
    }),
});

const upload = multer({ storage });

export default upload;
