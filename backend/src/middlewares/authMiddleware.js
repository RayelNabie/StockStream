import jwt from "jsonwebtoken";
import jwtConfig from "../config/jwtConfig.js";

export const authMiddleware = (req, res, next) => {
  if (!jwtConfig.enableJWT) {
    return next();
  }

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Authentication token required" });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};