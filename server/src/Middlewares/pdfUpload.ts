import { storage, localStorage } from "../lib/cloudinary";
import multer from "multer";

export const uploadPdf = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.fieldname !== "document") {
      return cb(new Error("Unexpected field"));
    }
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed"));
    }
    cb(null, true);
  },
  limits: { fileSize: 10 * 1024 * 1024 },
});
