// Additive seeding shared by `npm run seed` and the optional start-up sync.
// Only fills content types that have NO rows at all. Never updates, deletes or overwrites anything,
// and never touches admin users or enquiries.
import * as Content from '../models/content.js';
import * as Settings from '../models/settings.js';
import * as Pages from '../models/pages.js';
import * as seed from './seedData.js';

export async function seedMissing(log = console) {
  let added = 0;
  const groups = { service: seed.services, project: seed.projects, gallery: seed.gallery, testimonial: seed.testimonials, blog: seed.blog, team: seed.team, faq: seed.faqs, banner: seed.banners };
  for (const [type, list] of Object.entries(groups)) {
    const existing = await Content.countByType(type);
    if (existing > 0) { log.log(`- ${type}: ${existing} row(s) already exist, skipped`); continue; }
    await Content.insertMany(list); // one transaction per type
    added += list.length; log.log(`+ ${type}: added ${list.length}`);
  }
  if (await Settings.isEmpty()) { await Settings.save(seed.settings, 'seed'); added += 1; log.log('+ settings: created'); }
  if (!(await Pages.exists('home'))) {
    await Pages.upsert({ key: seed.homePage.key, title: seed.homePage.title, status: seed.homePage.status, sections: seed.homePage.sections, updatedBy: 'seed' });
    added += 1; log.log('+ home page: created');
  }
  return added;
}
