import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME || "Online-Tutor",
  api_key: process.env.CLOUD_API_KEY || "183183784345962",
  api_secret: process.env.CLOUD_API_SECRET || "uvJ8ued6DpyNJ32QvlUk9LufR5U",
});

export const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: "online-tutor",
      allowed_formats: ["jpg", "png", "pdf", "docx", "pptx"],
      resource_type: "auto",
      // resource_type: "raw", // Important for non-image files
      public_id: `${Date.now()}-${file.originalname}`,
    };
  },
});

const upload = multer({ storage: storage });

export default upload;
