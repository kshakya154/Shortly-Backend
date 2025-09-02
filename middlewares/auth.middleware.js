import jwt from "jsonwebtoken";
import User from "../models/user.model.js"; // import your user model

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");

    // Fetch the user (excluding password)
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user; // attach full user object
    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({ message: "Token is not valid or expired" });
  }
};

export default authMiddleware;
