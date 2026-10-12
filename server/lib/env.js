import 'dotenv/config';

export const isProd = process.env.NODE_ENV === 'production';

export function clientOrigins() {
  const list = (process.env.CLIENT_URL || '')
    .split(',').map((v) => v.trim().replace(/\/+$/, '')).filter(Boolean);
  if (!isProd) list.push('http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:4173');
  return [...new Set(list)];
}

export function assertConfig() {
  const problems = [];
  if (!process.env.MONGO_URI) problems.push('MONGO_URI is missing.');
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) problems.push('JWT_SECRET must be at least 32 characters.');
  if (isProd && !process.env.CLIENT_URL) problems.push('CLIENT_URL is required in production (CORS).');
  return problems;
}
