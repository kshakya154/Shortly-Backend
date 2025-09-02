import express from "express"
import { handleGenerateShortURL, handleGetAnalytics } from "../controllers/url.controller.js"
// import { login, signup } from "../controllers/user.controller.js";

const route=express.Router();

route.post('/url',handleGenerateShortURL);

route.get('/analytics',handleGetAnalytics);

export default route;