// Additive seeding shared by `npm run seed` and the optional start-up sync.
// Only fills content types that have NO records at all. Never updates, deletes or overwrites anything,
// and never touches admin users or enquiries.
import ContentItem from '../models/ContentItem.js';
import Setting from '../models/Setting.js';
import Page from '../models/Page.js';
import * as seed from './seedData.js';

export async function seedMissing(log = console) {
  let added = 0;
  const groups = { service: seed.services, project: seed.projects, gallery: seed.gallery, testimonial: seed.testimonials, blog: seed.blog, team: seed.team, faq: seed.faqs, banner: seed.banners };
  for (const [label, list] of Object.entries(groups)) {
    const existing = await ContentItem.countDocuments({ type: label });
    if (existing > 0) { log.log(`- ${label}: ${existing} item(s) already exist, skipped`); continue; }
    await ContentItem.insertMany(list);
    added += list.length; log.log(`+ ${label}: added ${list.length}`);
  }
  if (!(await Setting.exists({ key: 'site' }))) { await Setting.create({ key: 'site', data: seed.settings }); added += 1; log.log('+ settings: created'); }
  if (!(await Page.exists({ key: 'home' }))) { await Page.create(seed.homePage); added += 1; log.log('+ home page: created'); }
  return added;
}
