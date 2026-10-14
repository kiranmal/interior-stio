import { createApp } from "../app.js";
import { connectDb } from "../lib/db.js";

const app = createApp();

export default async function handler(req, res) {
  try {
    await connectDb();
    return app(req, res);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);

    return res.status(503).json({
      error: "Service temporarily unavailable. Please try again shortly.",
    });
  }
}
