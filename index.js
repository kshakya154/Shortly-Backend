import express from "express";
import cors from "cors";
import route from "./routes/url.route.js";
import connectDB from "./utils/db.js";
import URL from "./models/url.model.js";
import authMiddleware from "./middlewares/auth.middleware.js";
import userRoutes from "./routes/user.routes.js";
import cookieParser from "cookie-parser";
const app = express();
import dotenv from "dotenv";
// ✅ Enable CORS before routes
app.use(
  cors({
    origin: "https://shortly-seven-chi.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
dotenv.config();
// ✅ Your routes
app.use("/", userRoutes);
app.use("/", authMiddleware, route);

app.get("/me", authMiddleware, (req, res) => {
  // authMiddleware already fetched and attached the user
  res.json({ user: req.user });
});

app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    { shortId },
    {
      $push: { visitHistory: { timestamp: Date.now() } },
    }
  );
  res.redirect(entry.redirectedUrl);
});

const PORT = 8000;

app.listen(PORT, () => {
  console.log(`app is listening on port ${PORT}`);
  connectDB();
});
