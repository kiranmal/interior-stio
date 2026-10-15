import { Router } from 'express';
import * as Content from '../models/content.js';
import { CONTENT_TYPES, SLUG_TYPES } from '../models/content.js';
import auth, { requireRole } from '../middleware/auth.js';
import {
  str, urlOrPath, bool, int, slugify, cleanMeta, cleanSeo, isId, ValidationError, wrap,
} from '../lib/validate.js';

const router = Router();
const validType = (t) => CONTENT_TYPES.includes(t);

/** Whitelist + validate a content payload. `partial` = PATCH (only touch supplied fields). */
export function sanitizeContent(body = {}, { partial = false } = {}) {
  const out = {};
  const has = (k) => body[k] !== undefined;
  const text = (k, max) => { if (!partial || has(k)) out[k] = str(body[k], max); };

  if (!partial || has('type')) {
    if (!validType(body.type)) throw new ValidationError('Invalid content type.');
    out.type = body.type;
  }
  if (!partial || has('title')) {
    out.title = str(body.title, 160);
    if (!out.title) throw new ValidationError('Title is required.');
  }
  text('description', 2000); text('category', 100); text('location', 120); text('author', 100);
  if (!partial || has('content')) out.content = String(body.content ?? '').slice(0, 60000);
  if (has('slug')) { out.slug = slugify(body.slug); }

  for (const key of ['image']) {
    if (!partial || has(key)) {
      const v = urlOrPath(body[key]);
      if (v === null) throw new ValidationError('Image must be a valid http(s) URL or an uploaded image path.');
      out[key] = v;
    }
  }
  if (!partial || has('gallery')) {
    const list = Array.isArray(body.gallery) ? body.gallery : String(body.gallery || '').split('\n');
    out.gallery = list.map((v) => str(v, 1000)).filter(Boolean).slice(0, 40).map((v) => {
      const u = urlOrPath(v);
      if (u === null) throw new ValidationError(`Invalid gallery image URL: ${v.slice(0, 60)}`);
      return u;
    });
  }
  if (!partial || has('tags')) {
    const list = Array.isArray(body.tags) ? body.tags : String(body.tags || '').split(',');
    out.tags = [...new Set(list.map((t) => str(t, 40)).filter(Boolean))].slice(0, 20);
  }
  if (!partial || has('meta')) out.meta = cleanMeta(body.meta);
  if (has('seo')) out.seo = cleanSeo(body.seo);
  if (!partial || has('order')) out.order = int(body.order, 0, -100000, 100000);
  if (!partial || has('active')) out.active = bool(body.active, true);
  if (!partial || has('featured')) out.featured = bool(body.featured, false);
  if (has('publishedAt')) {
    if (!body.publishedAt) out.publishedAt = undefined;
    else { const d = new Date(body.publishedAt); if (Number.isNaN(d.getTime())) throw new ValidationError('Invalid publish date.'); out.publishedAt = d; }
  }
  return out;
}

async function uniqueSlug(type, base, excludeId) {
  let slug = base || 'item';
  let n = 1;
  // eslint-disable-next-line no-await-in-loop
  while (await Content.slugTaken(type, slug, excludeId)) { n += 1; slug = `${base || 'item'}-${n}`; }
  return slug;
}

/* ---------- Public ---------- */
router.get('/', wrap(async (req, res) => {
  const type = str(req.query.type, 20);
  if (type && !validType(type)) return res.status(400).json({ error: 'Invalid content type.' });
  const items = await Content.listPublic({
    type: type || undefined, category: str(req.query.category, 100) || undefined,
    featured: req.query.featured === 'true', limit: int(req.query.limit, 100, 1, 200),
  });
  // hasAny=false means the table has no rows of this type at all (not merely unpublished) so the site can show defaults.
  const hasAny = items.length > 0 || !type ? true : await Content.hasAny(type);
  res.set('Cache-Control', 'public, max-age=30');
  res.json({ items, hasAny });
}));

/* ---------- Admin (editor or admin) ---------- */
router.get('/admin', auth, requireRole('editor'), wrap(async (req, res) => {
  const type = str(req.query.type, 20);
  const limit = int(req.query.limit, 20, 1, 100);
  const page = int(req.query.page, 1, 1, 100000);
  const { items, total } = await Content.listAdmin({
    type: type && validType(type) ? type : undefined, q: str(req.query.q, 80),
    status: req.query.status === 'published' || req.query.status === 'draft' ? req.query.status : undefined, limit, page,
  });
  res.json({ items, total, page, pages: Math.max(1, Math.ceil(total / limit)) });
}));

router.post('/admin', auth, requireRole('editor'), wrap(async (req, res) => {
  const data = sanitizeContent(req.body);
  if (SLUG_TYPES.includes(data.type)) data.slug = await uniqueSlug(data.type, data.slug || slugify(data.title));
  else delete data.slug;
  if (data.type === 'blog' && !data.publishedAt) data.publishedAt = new Date();
  res.status(201).json({ item: await Content.create(data) });
}));

router.post('/admin/reorder', auth, requireRole('editor'), wrap(async (req, res) => {
  const ids = Array.isArray(req.body?.ids) ? req.body.ids.filter(isId).slice(0, 500) : [];
  if (!ids.length) throw new ValidationError('No items to reorder.');
  await Content.reorder(ids);
  res.json({ ok: true });
}));

router.patch('/admin/:id', auth, requireRole('editor'), wrap(async (req, res) => {
  if (!isId(req.params.id)) throw new ValidationError('Invalid id.');
  const current = await Content.findById(req.params.id);
  if (!current) return res.status(404).json({ error: 'Content item not found.' });
  const data = sanitizeContent(req.body, { partial: true });
  delete data.type; // type cannot change
  if (SLUG_TYPES.includes(current.type)) {
    if (data.slug !== undefined || (!current.slug && data.title)) {
      const base = slugify(data.slug || current.slug || data.title || current.title);
      data.slug = await uniqueSlug(current.type, base, current.id);
    }
  } else delete data.slug;
  res.json({ item: await Content.update(current.id, data) });
}));

router.delete('/admin/:id', auth, requireRole('editor'), wrap(async (req, res) => {
  if (!isId(req.params.id)) throw new ValidationError('Invalid id.');
  if (!(await Content.remove(req.params.id))) return res.status(404).json({ error: 'Content item not found.' });
  res.json({ ok: true });
}));

/* ---------- Public detail (must stay after /admin routes) ---------- */
router.get('/:type/:slug', wrap(async (req, res) => {
  const { type } = req.params;
  if (!validType(type)) return res.status(404).json({ error: 'Not found.' });
  const key = str(req.params.slug, 120).toLowerCase();
  const item = await Content.findPublic(type, key, isId(req.params.slug));
  if (!item) return res.status(404).json({ error: 'Not found.' });
  res.set('Cache-Control', 'public, max-age=30');
  res.json({ item });
}));

export default router;
