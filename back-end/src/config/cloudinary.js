import { v2 as cloudinary } from "cloudinary";

// ✅ Export function that will be called AFTER dotenv loads
export function configureCloudinary() {
  console.log("🔍 Configuring Cloudinary:");
  console.log("CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME);
  console.log("CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY);
  console.log("CLOUDINARY_API_SECRET:", process.env.CLOUDINARY_API_SECRET ? "✅ Set" : "❌ Missing");

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const config = cloudinary.config();
  console.log("✅ Cloudinary configured:", config.cloud_name ? "SUCCESS" : "FAILED");
}

export default cloudinary;