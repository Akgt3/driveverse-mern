// Test if Cloudinary env is loaded
// Run: node test-cloudinary.js

import dotenv from "dotenv";
dotenv.config();

console.log("🔍 Checking Environment Variables:");
console.log("CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY);
console.log("CLOUDINARY_API_SECRET:", process.env.CLOUDINARY_API_SECRET ? "✅ Set" : "❌ Missing");

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY) {
  console.log("\n❌ CLOUDINARY NOT CONFIGURED IN .ENV FILE");
  console.log("Add these lines to your .env file:");
  console.log(`
CLOUDINARY_CLOUD_NAME=dxffyfikl
CLOUDINARY_API_KEY=671932815711851
CLOUDINARY_API_SECRET=_tOaqKe8n6WeE_EZ2QW5MdmWorM
  `);
} else {
  console.log("\n✅ Cloudinary is configured correctly!");
}