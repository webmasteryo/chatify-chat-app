import { v2 as cloudinary } from "cloudinary";
import { ENV } from "./env";

cloudinary.config({
  cloud_name: ENV.CLOUDINARY_NAME,
  cloudinary_api_key: ENV.CLOUDINARY_API_KEY,
  cloudinary_api_secret: ENV.CLOUDINARY_API_SECRET,
});

export default cloudinary;
