import express from "express";
import { signup, login } from "../controllers/user.controller.js";

const userRoutes = express.Router();
userRoutes.post("/signup", signup);
userRoutes.post("/login", login);
userRoutes.post("/logout", (req, res) => {
  // Clear the token cookie
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
  });
  res.status(200).json({ message: "Logged out successfully" });
});

export default userRoutes;
