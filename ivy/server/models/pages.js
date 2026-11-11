import { query, tx } from '../lib/db.js';
import { parseJson, toJson, nn, bit } from './util.js';

export const SECTION_TYPES = ['hero', 'intro', 'text', 'banner', 'cta', 'services', 'projects', 'gallery', 'testimonials', 'blog', 'faq', 'process', 'team'];

const mapSection = (s) => ({ id: s.section_uid, type: s.type, heading: s.heading || '', subheading: s.subheading || '', body: s.body || '', image: s.image || '', ctaLabel: s.cta_label || '', ctaUrl: s.cta_url || '', visible: Boolean(s.visible) });
const mapPage = (p, sections) => ({ _id: String(p.id), key: p.page_key, title: p.title, status: p.status, sections: sections.map(mapSection), seo: parseJson(p.seo, undefined) || undefined, updatedBy: nn(p.updated_by), createdAt: p.created_at, updatedAt: p.updated_at });

async function withSections(pages) {
  if (!pages.length) return [];
  const secs = await query('SELECT * FROM page_sections WHERE page_id IN (?) ORDER BY page_id, position', [pages.map((p) => p.id)]);
  return pages.map((p) => mapPage(p, secs.filter((s) => s.page_id === p.id)));
}

export async function getPublished(key) {
  const rows = await query("SELECT * FROM pages WHERE page_key = ? AND status = 'published' LIMIT 1", [key]);
  const [page] = await withSections(rows);
  if (page) page.sections = page.sections.filter((s) => s.visible);
  return page || null;
}
export async function listPublished() { return (await query("SELECT id, page_key, title, updated_at FROM pages WHERE status = 'published'")).map((p) => ({ key: p.page_key, title: p.title, updatedAt: p.updated_at })); }
export async function listAll() { return withSections(await query('SELECT * FROM pages ORDER BY page_key')); }
export async function listPublishedKeys() { return (await query("SELECT page_key, updated_at FROM pages WHERE status = 'published' AND page_key <> 'home'")).map((p) => ({ key: p.page_key, updatedAt: p.updated_at })); }
export async function count() { return (await query('SELECT COUNT(*) AS n FROM pages'))[0].n; }
export async function exists(key) { return (await query('SELECT 1 FROM pages WHERE page_key = ? LIMIT 1', [key])).length > 0; }

/** Create or replace a page and its ordered sections atomically. */
export async function upsert({ key, title, status, sections, seo, updatedBy }) {
  await tx(async (t) => {
    await t.query(
      `INSERT INTO pages (page_key, title, status, seo, updated_by) VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE title = VALUES(title), status = VALUES(status), seo = COALESCE(VALUES(seo), seo), updated_by = VALUES(updated_by)`,
      [key, title, status, toJson(seo), updatedBy || null],
    );
    const [{ id }] = await t.query('SELECT id FROM pages WHERE page_key = ?', [key]);
    await t.query('DELETE FROM page_sections WHERE page_id = ?', [id]);
    let pos = 0;
    for (const s of sections) {
      pos += 1;
      await t.query(
        'INSERT INTO page_sections (page_id, section_uid, position, type, heading, subheading, body, image, cta_label, cta_url, visible) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [id, s.id, pos, s.type, s.heading || null, s.subheading || null, s.body || null, s.image || null, s.ctaLabel || null, s.ctaUrl || null, bit(s.visible)],
      );
    }
  });
  const [page] = await withSections(await query('SELECT * FROM pages WHERE page_key = ?', [key]));
  return page;
}
export async function remove(key) { return (await query('DELETE FROM pages WHERE page_key = ?', [key])).affectedRows > 0; } // sections cascade
