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
    origin: "https://shortly-seven-chi.vercel.app", // ❌ remove trailing /
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔓 Public routes
app.use("/", userRoutes);

// 🔓 Public shortId redirect route
app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    { shortId },
    { $push: { visitHistory: { timestamp: Date.now() } } }
  );

  if (!entry) {
    return res.status(404).json({ message: "Short URL not found" });
  }

  res.redirect(entry.redirectedUrl);
});

// 🔒 Protected routes (need token)
app.use("/", authMiddleware, route);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});
