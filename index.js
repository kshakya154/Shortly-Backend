import express from "express";
import cors from "cors";
import route from "./routes/url.route.js";
import connectDB from "./utils/db.js";
import URL from "./models/url.model.js";
import authMiddleware from "./middlewares/auth.middleware.js";
import userRoutes from "./routes/user.routes.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: "https://shortly-seven-chi.vercel.app", // ✅ no trailing slash
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔓 Public auth routes (register, login, logout, etc.)
app.use("/auth", userRoutes);

// 🔓 Public shortId redirect route (no token required)
app.get("/:shortId", async (req, res) => {
  try {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
      { shortId },
      { $push: { visitHistory: { timestamp: Date.now() } } }
    );

    if (!entry) {
      return res.status(404).json({ message: "Short URL not found" });
    }

    // ✅ redirect user to original URL
    return res.redirect(entry.redirectedUrl);
  } catch (err) {
    console.error("Redirect error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// 🔒 Protected routes (require login via cookie JWT)
app.use("/api", authMiddleware, route);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  connectDB();
});
