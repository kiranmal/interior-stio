// OPTIONAL one-time import of your OLD data from MongoDB `mongoexport` JSON files. It needs no MongoDB driver.
// 1) On a machine that can reach the old database:
//      mongoexport --uri="<old uri>" --collection=contentitems --jsonArray --out=contentitems.json
//      mongoexport --uri="<old uri>" --collection=enquiries    --jsonArray --out=enquiries.json
// 2) npm run db:import-mongo -- ./contentitems.json ./enquiries.json
// Additive and repeatable: rows that already exist (same type+slug/title for content; same phone+source+time for enquiries) are skipped.
// Admin users are NOT imported - create them with `npm run create-admin`.
import fs from 'node:fs';
import '../lib/env.js';
import { connectDb, assertSchema, closeDb, friendlyDbError, query } from '../lib/db.js';
import * as Content from '../models/content.js';
import { slugify, cleanMeta } from '../lib/validate.js';

const d = (v) => { const x = v?.$date ?? v; const t = x ? new Date(x) : null; return t && !Number.isNaN(t.getTime()) ? t : undefined; };
const files = process.argv.slice(2).filter((a) => !a.startsWith('--'));
if (!files.length) { console.error('Usage: npm run db:import-mongo -- contentitems.json [enquiries.json]'); process.exit(1); }

try {
  await connectDb(); await assertSchema();
  for (const file of files) {
    const rows = JSON.parse(fs.readFileSync(file, 'utf8'));
    const list = Array.isArray(rows) ? rows : [rows];
    let added = 0; let skipped = 0;
    for (const r of list) {
      if (r.type && r.title && Content.CONTENT_TYPES.includes(r.type)) {
        const slug = Content.SLUG_TYPES.includes(r.type) ? (r.slug || slugify(r.title)) : undefined;
        const dup = slug ? await Content.slugTaken(r.type, slug) : (await query('SELECT 1 FROM content_items WHERE type = ? AND title = ? LIMIT 1', [r.type, r.title])).length > 0;
        if (dup) { skipped += 1; continue; }
        await Content.create({ type: r.type, title: String(r.title).slice(0, 160), slug, description: r.description, content: r.content, image: r.image, gallery: r.gallery, category: r.category,
          location: r.location, tags: r.tags, author: r.author, meta: cleanMeta(r.meta), order: r.order ?? 0, active: r.active !== false, featured: Boolean(r.featured), publishedAt: d(r.publishedAt) });
        added += 1;
      } else if (r.phone && r.source) {
        const at = d(r.createdAt);
        if ((await query('SELECT 1 FROM enquiries WHERE phone = ? AND source = ? AND created_at = ? LIMIT 1', [r.phone, r.source, at || new Date(0)])).length) { skipped += 1; continue; }
        const res = await query(
          `INSERT INTO enquiries (name, phone, email, city, service, message, source, property_type, area, quality, budget, estimated_lower, estimated_upper, status, created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
          [r.name, r.phone, r.email || null, r.city || null, r.service || null, r.message || null, r.source, r.propertyType || null, r.area ?? null, r.quality || null, r.budget || null,
            r.estimatedLower ?? null, r.estimatedUpper ?? null, r.status || 'new', at || new Date()],
        );
        for (const n of r.notes || []) await query('INSERT INTO enquiry_notes (enquiry_id, text, created_by, created_at) VALUES (?,?,?,?)', [res.insertId, String(n.text || '').slice(0, 1000), n.by || null, d(n.at) || new Date()]);
        added += 1;
      } else skipped += 1;
    }
    console.log(`${file}: ${added} imported, ${skipped} skipped`);
  }
} catch (e) { console.error(`Import FAILED: ${friendlyDbError(e)}`); process.exitCode = 1; }
await closeDb();
