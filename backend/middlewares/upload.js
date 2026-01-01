import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    return {
      folder: "fixi/artisans",
      allowed_formats: ["jpg", "png", "jpeg"],
    };
  }
});

const upload = multer({ storage });

export default upload;