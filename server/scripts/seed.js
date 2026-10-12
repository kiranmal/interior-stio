// Safe, repeatable seed: ADDS missing defaults only. Never deletes, never overwrites existing documents,
// never touches admin users or enquiries.   Usage: npm run seed
import '../lib/env.js';
import mongoose from 'mongoose';
import { connectDb } from '../lib/db.js';
import ContentItem from '../models/ContentItem.js';
import Setting from '../models/Setting.js';
import Page from '../models/Page.js';
import * as seed from './seedData.js';

if (!process.env.MONGO_URI) { console.error('MONGO_URI is not set.'); process.exit(1); }
await connectDb();
let added = 0;

for (const [label, list] of Object.entries({ service: seed.services, project: seed.projects, gallery: seed.gallery, testimonial: seed.testimonials, blog: seed.blog, team: seed.team, faq: seed.faqs, banner: seed.banners })) {
  const existing = await ContentItem.countDocuments({ type: list[0].type });
  if (existing > 0) { console.log(`- ${label}: ${existing} item(s) already exist, skipped`); continue; }
  await ContentItem.insertMany(list);
  added += list.length;
  console.log(`+ ${label}: added ${list.length}`);
}
if (!(await Setting.exists({ key: 'site' }))) { await Setting.create({ key: 'site', data: seed.settings }); console.log('+ settings: created'); added += 1; } else console.log('- settings exist, skipped');
if (!(await Page.exists({ key: 'home' }))) { await Page.create(seed.homePage); console.log('+ home page: created'); added += 1; } else console.log('- home page exists, skipped');

console.log(`Done. ${added} record(s) added.`);
await mongoose.disconnect();
