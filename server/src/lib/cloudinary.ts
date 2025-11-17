import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME || "Online-Tutor",
  api_key: process.env.CLOUD_API_KEY || "183183784345962",
  api_secret: process.env.CLOUD_API_SECRET || "uvJ8ued6DpyNJ32QvlUk9LufR5U",
});

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

export { upload, cloudinary };
