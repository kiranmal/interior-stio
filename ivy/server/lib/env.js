import "dotenv/config";
import fs from "node:fs";
import path from "node:path";

export const isProd = process.env.NODE_ENV === "production";

export function clientOrigins() {
  const list = (process.env.CLIENT_URL || "")
    .split(",")
    .map((v) => v.trim().replace(/\/+$/, ""))
    .filter(Boolean);
  if (!isProd)
    list.push(
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://localhost:4173",
    );
  return [...new Set(list)];
}

export function dbConfig(overrides = {}) {
  let ssl;

  if (process.env.DB_SSL === "true") {
    const ca = process.env.DB_SSL_CA_CONTENT;

    if (!ca) {
      throw new Error(
        "DB_SSL_CA_CONTENT is missing. Add the full CA certificate to Vercel Production Environment Variables.",
      );
    }

    ssl = {
      ca,
      rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== "false",
    };
  }

  return {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl,
    ...overrides,
  };
}

export function assertConfig() {
  const problems = [];
  for (const k of ["DB_HOST", "DB_USER", "DB_NAME"])
    if (!process.env[k]) problems.push(`${k} is missing.`);
  if (process.env.DB_PASSWORD === undefined)
    problems.push(
      "DB_PASSWORD is missing (set it to an empty value only for a local passwordless database).",
    );
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32)
    problems.push("JWT_SECRET must be at least 32 characters.");
  if (isProd && !process.env.CLIENT_URL)
    problems.push("CLIENT_URL is required in production (CORS).");
  return problems;
}
