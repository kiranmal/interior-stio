// Adds missing slugs to services/projects/blog posts (additive; never changes existing slugs).
import '../lib/env.js';
import { connectDb, assertSchema, closeDb, friendlyDbError } from '../lib/db.js';
import * as Content from '../models/content.js';
import { slugify } from '../lib/validate.js';

try {
  await connectDb(); await assertSchema();
  let n = 0;
  for (const type of Content.SLUG_TYPES) {
    for (const item of await Content.missingSlugs(type)) {
      const base = slugify(item.title) || 'item'; let slug = base; let i = 1;
      while (await Content.slugTaken(type, slug, item.id)) { i += 1; slug = `${base}-${i}`; }
      await Content.update(item.id, { slug }); n += 1;
    }
  }
  console.log(`Added ${n} slug(s).`);
} catch (e) { console.error(`migrate:slugs FAILED: ${friendlyDbError(e)}`); process.exitCode = 1; }
await closeDb();
