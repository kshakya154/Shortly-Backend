import { nanoid } from "nanoid";
import URL from "../models/url.model.js";
async function handleGenerateShortURL(req, res) {
  const { url } = req.body;
  console.log("Url", url);
  if (!url) {
    return res.status(400).json({
      message: "Url is reqired",
    });
  }
  const shortID = nanoid(8);

  await URL.create({
    shortId: shortID,
    redirectedUrl: url,
    visitHistory: [],
    ownerId: req.user.id,
  });
  return res.status(200).json({ id: shortID });
}

async function handleGetAnalytics(req, res) {
  try {
    // ✅ Step 1: Get the logged-in user id from JWT middleware
    const userId = req.user.id; // middleware must set req.user
    console.log("Userid:", userId);
    // ✅ Step 2: Find all URLs created by this user
    const urls = await URL.find({ ownerId: userId });

    // ✅ Step 3: Format the response (shortId, original URL, clicks, visit history)
    const analytics = urls.map((url) => ({
      shortId: url.shortId,
      redirectedUrl: url.redirectedUrl,
      TotalClicks: url.visitHistory.length,
      analytics: url.visitHistory,
    }));

    // ✅ Step 4: Send back the result
    return res.json({ urls: analytics });
  } catch (err) {
    console.error("Error in getUserAnalytics:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export { handleGenerateShortURL, handleGetAnalytics };
