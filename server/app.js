import express from "express";
import cors from "cors";
import helmet from "helmet";
import { clientOrigins, isProd } from "./lib/env.js";
import { dbReady, connectDb } from "./lib/db.js";
import { sanitizeInput } from "./lib/validate.js";
import { apiLimiter } from "./middleware/rateLimit.js";
import enquiryRoute from "./routes/enquiry.js";
import adminRoute from "./routes/admin.js";
import contentRoute from "./routes/content.js";
import publicRoute from "./routes/public.js";

export function createApp() {
  const app = express();
  app.disable("x-powered-by");
  if (process.env.TRUST_PROXY)
    app.set(
      "trust proxy",
      Number(process.env.TRUST_PROXY) || process.env.TRUST_PROXY,
    );

  app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

  const origins = clientOrigins();
  app.use(
    cors({
      // Disallowed origins simply get no CORS headers (browser blocks) instead of a 500 error.
      origin: (origin, cb) =>
        cb(null, !origin || origins.includes(origin.replace(/\/+$/, ""))),
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      maxAge: 600,
    }),
  );

  app.use(express.json({ limit: "200kb" }));
  app.use(sanitizeInput);

  app.get("/api/health", (_req, res) =>
    res.json({
      ok: true,
      service: "Ivy Interio API",
      database: dbReady() ? "connected" : "disconnected",
    }),
  );

  // Everything below needs the database.
  app.use(async (req, res, next) => {
    if (dbReady()) return next();

    try {
      await connectDb();
      return next();
    } catch (err) {
      console.error("Database unavailable:", err.message);

      return res.status(503).json({
        error: "Service temporarily unavailable. Please try again shortly.",
      });
    }
  });

  app.use("/api/enquiry", enquiryRoute);
  app.use("/api/admin", adminRoute);
  app.use("/api/content", apiLimiter, contentRoute);
  app.use(publicRoute);

  app.use("/api", (_req, res) => res.status(404).json({ error: "Not found." }));

  // eslint-disable-next-line no-unused-vars
  app.use((err, _req, res, _next) => {
    if (err?.type === "entity.parse.failed")
      return res.status(400).json({ error: "Invalid JSON body." });
    if (err?.type === "entity.too.large")
      return res.status(413).json({ error: "Request body too large." });
    if (err?.name === "ValidationError" && err.errors)
      return res.status(400).json({
        error: Object.values(err.errors)[0]?.message || "Invalid data.",
      });
    if (err?.code === 11000)
      return res
        .status(409)
        .json({ error: "A record with that value already exists." });
    if (err?.expose)
      return res.status(err.status || 400).json({ error: err.message });
    console.error("Unhandled error:", isProd ? err?.message : err); // never send details to clients
    return res.status(500).json({ error: "Internal server error." });
  });
  return app;
}
