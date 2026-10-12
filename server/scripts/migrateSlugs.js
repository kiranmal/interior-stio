// Adds missing slugs to existing services/projects/blog posts (additive; never changes existing slugs).
import '../lib/env.js';
import mongoose from 'mongoose';
import { connectDb } from '../lib/db.js';
import ContentItem, { SLUG_TYPES } from '../models/ContentItem.js';
import { slugify } from '../lib/validate.js';

await connectDb();
let n = 0;
for (const type of SLUG_TYPES) {
  const items = await ContentItem.find({ type, $or: [{ slug: { $exists: false } }, { slug: null }, { slug: '' }] });
  for (const item of items) {
    const base = slugify(item.title) || 'item'; let slug = base; let i = 1;
    while (await ContentItem.exists({ type, slug })) { i += 1; slug = `${base}-${i}`; }
    item.slug = slug; await item.save(); n += 1;
  }
}
console.log(`Added ${n} slug(s).`);
await mongoose.disconnect();
