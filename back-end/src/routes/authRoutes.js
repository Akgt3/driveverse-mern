import express from "express";
import {
  registerUser,
  loginUser,
  googleAuth
} from "../controllers/authController.js";
import { adminLogin } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleAuth); // ✅ Google login via ID token
router.post("/admin/login", adminLogin);

export default router;
