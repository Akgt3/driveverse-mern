import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // ✅ ADMIN TOKEN (NO DB LOOKUP)
      if (decoded.role === "admin") {
        req.user = {
          _id: "admin",
          role: "admin",
        };
        return next();
      }

      // ✅ NORMAL USER
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      // 🚫 BLOCK CHECK - THIS MUST WORK!
      if (user.status === "blocked") {
        return res.status(403).json({
          message: "Your account is blocked",
          code: "ACCOUNT_BLOCKED",
        });
      }

      // ✅ USER IS ALLOWED - SET AND CONTINUE
      req.user = user;
      next();

      // ❌ REMOVED DUPLICATE CODE BELOW (was causing bypass)

    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
  } else {
    return res.status(401).json({ message: "No token provided" });
  }
};

export default protect;