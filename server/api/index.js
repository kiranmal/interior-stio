
@'
import "../lib/env.js";
import { createApp } from "../app.js";
import { connectDb, assertSchema } from "../lib/db.js";

const app = createApp();
let initialization;

async function initialize() {
  await connectDb();
  await assertSchema();
}

export default async function handler(req, res) {
  try {
    initialization ??= initialize().catch((error) => {
      initialization = undefined;
      throw error;
    });

    await initialization;
    return app(req, res);
  } catch (error) {
    console.error("MySQL connection/schema check failed:", error.message);

    return res.status(503).json({
      error: "Service temporarily unavailable. Please try again shortly.",
    });
  }
}
'@ | Set-Content .\api\index.js -Encoding utf8
