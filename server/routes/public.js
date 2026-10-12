import { Router } from 'express';
import Setting from '../models/Setting.js';
import Page from '../models/Page.js';
import Seo from '../models/Seo.js';
import ContentItem from '../models/ContentItem.js';
import { str, wrap } from '../lib/validate.js';

const router = Router();

router.get('/api/settings', wrap(async (_req, res) => {
  const doc = await Setting.findOne({ key: 'site' }).lean();
  res.set('Cache-Control', 'public, max-age=60');
  res.json({ settings: doc?.data || {} });
}));

router.get('/api/pages', wrap(async (_req, res) => {
  res.json({ pages: await Page.find({ status: 'published' }).select('key title updatedAt').lean() });
}));

router.get('/api/pages/:key', wrap(async (req, res) => {
  const page = await Page.findOne({ key: str(req.params.key, 100).toLowerCase(), status: 'published' }).lean();
  if (!page) return res.status(404).json({ error: 'Page not found.' });
  page.sections = (page.sections || []).filter((s) => s.visible !== false);
  res.set('Cache-Control', 'public, max-age=30');
  res.json({ page });
}));

router.get('/api/seo', wrap(async (req, res) => {
  const path = str(req.query.path, 200) || '/';
  res.set('Cache-Control', 'public, max-age=60');
  res.json({ seo: (await Seo.findOne({ path }).lean()) || null });
}));

const STATIC = ['/', '/about', '/services', '/projects', '/gallery', '/team', '/testimonials', '/blog', '/contact', '/get-a-quote', '/faqs', '/privacy-policy', '/terms-and-conditions'];
router.get('/sitemap.xml', wrap(async (_req, res) => {
  const site = (process.env.SITE_URL || '').replace(/\/+$/, '');
  const now = new Date();
  const items = await ContentItem.find({ active: true, type: { $in: ['service', 'project', 'blog'] }, slug: { $type: 'string' } }).select('type slug updatedAt publishedAt').lean();
  const pages = await Page.find({ status: 'published', key: { $ne: 'home' } }).select('key updatedAt').lean();
  const prefix = { service: '/services/', project: '/projects/', blog: '/blog/' };
  const urls = [
    ...STATIC.map((p) => ({ loc: p })),
    ...items.filter((i) => i.type !== 'blog' || !i.publishedAt || i.publishedAt <= now).map((i) => ({ loc: prefix[i.type] + i.slug, lastmod: i.updatedAt })),
    ...pages.map((p) => ({ loc: `/p/${p.key}`, lastmod: p.updatedAt })),
  ];
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${esc(site + u.loc)}</loc>${u.lastmod ? `<lastmod>${new Date(u.lastmod).toISOString()}</lastmod>` : ''}</url>`).join('\n')}\n</urlset>`;
  res.type('application/xml').send(xml);
}));
router.get('/robots.txt', (_req, res) => {
  const site = (process.env.SITE_URL || '').replace(/\/+$/, '');
  res.type('text/plain').send(`User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: ${site}/sitemap.xml\n`);
});

export default router;
