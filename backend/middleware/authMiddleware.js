/* global process */
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "❌ Access denied. No token provided." });
  }

  try {
    const JWT_SECRET = process.env.JWT_SECRET || "mySecretKey123";
    const decoded = jwt.verify(token, JWT_SECRET); // contains id, role, name
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Token verification error:", err.message);
    res.status(400).json({ message: "❌ Invalid or expired token." });
  }
};
