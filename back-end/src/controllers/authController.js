import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const AVATAR_COLORS = [
  "2563eb",
  "7c3aed",
  "db2777",
  "059669",
  "d97706",
  "0f766e",
  "4f46e5",
  "9333ea",
  "dc2626",
  "16a34a",
];

const generateAvatar = (name) => {
  const color =
    AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];

  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
    name
  )}&backgroundColor=${color}&textColor=ffffff`;
};

/* REGISTER */
export const registerUser = async (req, res) => {
  const { name, email, password, place } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    place,
    avatar: generateAvatar(name),
    authProvider: "local",
  });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

  res.json({ user, token });
};

/* LOGIN */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 🚫 BLOCKED USER CHECK
    if (user.status === "blocked") {
      return res
        .status(403)
        .json({ message: "Your account is blocked. Contact support." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ user, token });
  } catch {
    res.status(500).json({ message: "Login failed" });
  }
};

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  if (
    email !== process.env.ADMIN_EMAIL ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({ message: "Invalid admin credentials" });
  }

  const token = jwt.sign(
    { id: "admin", role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
  res.json({
    user: {
      name: "Admin",
      email,
      role: "admin",
      avatar: "https://i.pravatar.cc/150?img=68",
    },
    token,
  });
};

/* GOOGLE AUTH */
export const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name, picture } = ticket.getPayload();

    let user = await User.findOne({ email });

    // 🚫 CHECK IF USER IS BLOCKED (BEFORE LOGIN)
    if (user && user.status === "blocked") {
      return res
        .status(403)
        .json({ message: "Your account is blocked. Contact support." });
    }

    // CREATE NEW USER IF DOESN'T EXIST
    if (!user) {
      user = await User.create({
        name,
        email,
        password: null,
        avatar: picture || generateAvatar(name),
        authProvider: "google",
      });
    }

    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ user, token: jwtToken });
  } catch (err) {
    res.status(500).json({ message: "Google authentication failed" });
  }
};