import mongoose from 'mongoose';

export const isId = (v) => mongoose.isValidObjectId(v) && String(v).length === 24;

export function str(v, max = 255) {
  if (v === undefined || v === null) return '';
  return String(v).replace(/\u0000/g, '').trim().slice(0, max);
}

/** Accepts '', absolute http(s) URLs, or site-relative paths. Returns null when invalid. */
export function urlOrPath(v, max = 1000) {
  const s = str(v, max);
  if (!s) return '';
  if (s.startsWith('/') && !s.startsWith('//')) return s;
  try { const u = new URL(s); return ['http:', 'https:'].includes(u.protocol) ? s : null; }
  catch { return null; }
}

export const bool = (v, d = false) => (v === undefined ? d : v === true || v === 'true' || v === 1 || v === '1');
export const int = (v, d = 0, min = -1e9, max = 1e9) => {
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : d;
};
export const escapeRegex = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

export function slugify(v) {
  return str(v, 160).toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 100);
}

export class ValidationError extends Error {
  constructor(message, status = 400) { super(message); this.status = status; this.expose = true; }
}

export function cleanMeta(input) {
  const out = {};
  if (!input || typeof input !== 'object' || Array.isArray(input)) return out;
  for (const [k, v] of Object.entries(input).slice(0, 30)) {
    if (!/^[A-Za-z][A-Za-z0-9_]{0,40}$/.test(k)) continue;
    if (typeof v === 'number' || typeof v === 'boolean') out[k] = v;
    else if (typeof v === 'string') out[k] = v.slice(0, 1000);
  }
  return out;
}

export function cleanSeo(input) {
  const s = input && typeof input === 'object' ? input : {};
  const canonical = urlOrPath(s.canonical);
  const ogImage = urlOrPath(s.ogImage);
  if (canonical === null) throw new ValidationError('SEO canonical URL is not a valid URL.');
  if (ogImage === null) throw new ValidationError('SEO social image is not a valid URL.');
  return { title: str(s.title, 70), description: str(s.description, 200), canonical, ogImage };
}

/** Remove Mongo operator keys ($…, a.b) from user input to block NoSQL injection. */
export function stripOperators(value, depth = 0) {
  if (depth > 8 || value === null || typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map((v) => stripOperators(v, depth + 1));
  const out = {};
  for (const [k, v] of Object.entries(value)) {
    if (k.startsWith('$') || k.includes('.')) continue;
    out[k] = stripOperators(v, depth + 1);
  }
  return out;
}
export const sanitizeInput = (req, _res, next) => {
  if (req.body) req.body = stripOperators(req.body);
  if (req.query) for (const k of Object.keys(req.query)) { if (k.startsWith('$') || k.includes('.')) delete req.query[k]; }
  next();
};

export const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
