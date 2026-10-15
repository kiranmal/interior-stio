import { query } from '../lib/db.js';
import { nn, bit } from './util.js';

const map = (r) => r && ({ _id: String(r.id), path: r.path, title: nn(r.title), description: nn(r.description), canonical: nn(r.canonical), ogImage: nn(r.og_image), noindex: Boolean(r.noindex), createdAt: r.created_at, updatedAt: r.updated_at });
export async function getByPath(path) { return map((await query('SELECT * FROM seo_entries WHERE path = ? LIMIT 1', [path]))[0]) || null; }
export async function listAll() { return (await query('SELECT * FROM seo_entries ORDER BY path')).map(map); }
export async function upsert({ path, title, description, canonical, ogImage, noindex }) {
  await query(
    `INSERT INTO seo_entries (path, title, description, canonical, og_image, noindex) VALUES (?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description), canonical = VALUES(canonical), og_image = VALUES(og_image), noindex = VALUES(noindex)`,
    [path, title || null, description || null, canonical || null, ogImage || null, bit(noindex)],
  );
  return getByPath(path);
}
export async function remove(id) { return (await query('DELETE FROM seo_entries WHERE id = ?', [id])).affectedRows > 0; }
