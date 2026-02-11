import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create storage engine
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "driveverse-cars",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 1200, height: 800, crop: "limit" }],
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

export default upload;
```

### D. Add Cloudinary Variables to Render

Go to Render → Your Service → Environment

Add these 3 new variables:
```
Key: CLOUDINARY_CLOUD_NAME
Value: your_cloud_name_from_cloudinary
  ```
```
Key: CLOUDINARY_API_KEY
Value: your_api_key_from_cloudinary
  ```
```
Key: CLOUDINARY_API_SECRET
Value: your_api_secret_from_cloudinary