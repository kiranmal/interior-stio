import { query, tx } from '../lib/db.js';
import { parseJson, toJson, nn, bit, likeTerm } from './util.js';

export const CONTENT_TYPES = ['service', 'project', 'gallery', 'testimonial', 'blog', 'team', 'faq', 'banner'];
export const SLUG_TYPES = ['service', 'project', 'blog'];

// API field -> column. JSON columns are marked.
const COLS = {
  type: 'type', title: 'title', slug: 'slug', description: 'description', content: 'content', image: 'image', category: 'category',
  location: 'location', author: 'author', order: 'sort_order', active: 'active', featured: 'featured', publishedAt: 'published_at',
  gallery: 'gallery', tags: 'tags', meta: 'meta', seo: 'seo',
};
const JSON_FIELDS = new Set(['gallery', 'tags', 'meta', 'seo']);
const BOOL_FIELDS = new Set(['active', 'featured']);

export function map(r) {
  if (!r) return null;
  const out = {
    _id: String(r.id), id: String(r.id), type: r.type, title: r.title, slug: nn(r.slug), description: nn(r.description), content: nn(r.content),
    image: nn(r.image), gallery: parseJson(r.gallery, []), category: nn(r.category), location: nn(r.location), tags: parseJson(r.tags, []),
    author: nn(r.author), meta: parseJson(r.meta, {}) || {}, seo: parseJson(r.seo, undefined) || undefined,
    order: r.sort_order, active: Boolean(r.active), featured: Boolean(r.featured),
    publishedAt: nn(r.published_at), createdAt: r.created_at, updatedAt: r.updated_at,
  };
  return out;
}

const publicWhere = (type) => {
  const where = ['active = 1']; const params = [];
  if (type) { where.push('type = ?'); params.push(type); }
  if (!type || type === 'blog') { where.push("(type <> 'blog' OR published_at IS NULL OR published_at <= ?)"); params.push(new Date()); }
  return { where, params };
};

export async function listPublic({ type, category, featured, limit = 100 }) {
  const { where, params } = publicWhere(type);
  if (category) { where.push('category = ?'); params.push(category); }
  if (featured) where.push('featured = 1');
  const rows = await query(`SELECT * FROM content_items WHERE ${where.join(' AND ')} ORDER BY sort_order ASC, created_at DESC LIMIT ?`, [...params, limit]);
  return rows.map(map);
}

export async function hasAny(type) {
  const rows = await query('SELECT 1 FROM content_items WHERE type = ? LIMIT 1', [type]);
  return rows.length > 0;
}

export async function findPublic(type, key, isNumericId) {
  const { where, params } = publicWhere(type);
  let rows = await query(`SELECT * FROM content_items WHERE ${where.join(' AND ')} AND slug = ? LIMIT 1`, [...params, key]);
  if (!rows.length && isNumericId) rows = await query(`SELECT * FROM content_items WHERE ${where.join(' AND ')} AND id = ? LIMIT 1`, [...params, key]);
  return map(rows[0]);
}

export async function listAdmin({ type, q, status, limit, page }) {
  const where = ['1=1']; const params = [];
  if (type) { where.push('type = ?'); params.push(type); }
  if (q) { const t = likeTerm(q); where.push("(title LIKE ? ESCAPE '\\\\' OR category LIKE ? ESCAPE '\\\\' OR slug LIKE ? ESCAPE '\\\\')"); params.push(t, t, t); }
  if (status === 'published') where.push('active = 1');
  if (status === 'draft') where.push('active = 0');
  const w = where.join(' AND ');
  const [rows, count] = await Promise.all([
    query(`SELECT * FROM content_items WHERE ${w} ORDER BY sort_order ASC, created_at DESC LIMIT ? OFFSET ?`, [...params, limit, (page - 1) * limit]),
    query(`SELECT COUNT(*) AS n FROM content_items WHERE ${w}`, params),
  ]);
  return { items: rows.map(map), total: count[0].n };
}

export async function findById(id) { return map((await query('SELECT * FROM content_items WHERE id = ? LIMIT 1', [id]))[0]); }

export async function slugTaken(type, slug, excludeId) {
  const rows = await query('SELECT 1 FROM content_items WHERE type = ? AND slug = ?' + (excludeId ? ' AND id <> ?' : '') + ' LIMIT 1', excludeId ? [type, slug, excludeId] : [type, slug]);
  return rows.length > 0;
}

function toRow(data) {
  const row = {};
  for (const [k, col] of Object.entries(COLS)) {
    if (!Object.prototype.hasOwnProperty.call(data, k)) continue;
    const v = data[k];
    if (JSON_FIELDS.has(k)) row[col] = toJson(v);
    else if (BOOL_FIELDS.has(k)) row[col] = bit(v);
    else row[col] = v === undefined || v === '' ? (k === 'order' ? 0 : null) : v;
  }
  return row;
}

export async function create(data) {
  const row = toRow(data);
  const cols = Object.keys(row);
  const res = await query(`INSERT INTO content_items (${cols.join(', ')}) VALUES (${cols.map(() => '?').join(', ')})`, cols.map((c) => row[c]));
  return findById(res.insertId);
}

export async function update(id, data) {
  const row = toRow(data);
  const cols = Object.keys(row);
  if (cols.length) await query(`UPDATE content_items SET ${cols.map((c) => `${c} = ?`).join(', ')} WHERE id = ?`, [...cols.map((c) => row[c]), id]);
  return findById(id);
}

export async function remove(id) { return (await query('DELETE FROM content_items WHERE id = ?', [id])).affectedRows > 0; }

export async function reorder(ids) {
  await tx(async (t) => { let i = 1; for (const id of ids) { await t.query('UPDATE content_items SET sort_order = ? WHERE id = ?', [i, id]); i += 1; } });
}

export async function countByType(type) { return (await query('SELECT COUNT(*) AS n FROM content_items WHERE type = ?', [type]))[0].n; }

/** Used by seeding: inserts a list in one transaction. */
export async function insertMany(list) {
  await tx(async (t) => {
    for (const d of list) {
      const row = toRow(d); const cols = Object.keys(row);
      await t.query(`INSERT INTO content_items (${cols.join(', ')}) VALUES (${cols.map(() => '?').join(', ')})`, cols.map((c) => row[c]));
    }
  });
}

export async function missingSlugs(type) { return (await query("SELECT * FROM content_items WHERE type = ? AND (slug IS NULL OR slug = '')", [type])).map(map); }

export async function sitemapItems() {
  const rows = await query("SELECT type, slug, updated_at, published_at FROM content_items WHERE active = 1 AND type IN ('service','project','blog') AND slug IS NOT NULL AND slug <> ''");
  return rows.map((r) => ({ type: r.type, slug: r.slug, updatedAt: r.updated_at, publishedAt: r.published_at }));
}

export async function stats() {
  const [byType, pub, recent] = await Promise.all([
    query('SELECT type, COUNT(*) AS n FROM content_items GROUP BY type'),
    query('SELECT SUM(active = 1) AS published, SUM(active = 0) AS drafts FROM content_items'),
    query('SELECT id, type, title, active, updated_at FROM content_items ORDER BY updated_at DESC LIMIT 8'),
  ]);
  return {
    contentByType: Object.fromEntries(byType.map((r) => [r.type, r.n])),
    published: Number(pub[0].published || 0), drafts: Number(pub[0].drafts || 0),
    recentContent: recent.map((r) => ({ _id: String(r.id), type: r.type, title: r.title, active: Boolean(r.active), updatedAt: r.updated_at })),
  };
}
