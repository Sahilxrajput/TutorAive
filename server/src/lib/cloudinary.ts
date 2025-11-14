import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import path from "path";
import fs from "fs";
import multer from "multer";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME || "Online-Tutor",
  api_key: process.env.CLOUD_API_KEY || "183183784345962",
  api_secret: process.env.CLOUD_API_SECRET || "uvJ8ued6DpyNJ32QvlUk9LufR5U",
});

export const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "submissions",
      format: "pdf",
      resource_type: "raw", // Important for non-image files
      public_id: `${Date.now()}-${file.originalname}`,
    };
  },
});

// Create the uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export const localStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Keep original name but prefix with timestamp for uniqueness
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    cb(null, `${baseName}-${Date.now()}${ext}`);
  },
});

export const uploadOnCloudinary = async (filePath: string) => {
  try {
    if (!filePath) return null;
    const res = await cloudinary.uploader.upload(filePath, {
      resource_type: "raw",
    });
    console.log("file :- ", res);
    return res;
  } catch (error) {
    console.log("cloudinary error ", error);
    return null;
  }
};
