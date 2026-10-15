import { Router } from 'express';
import * as Settings from '../models/settings.js';
import * as Pages from '../models/pages.js';
import * as Seo from '../models/seo.js';
import * as Content from '../models/content.js';
import { str, wrap } from '../lib/validate.js';

const router = Router();

router.get('/api/settings', wrap(async (_req, res) => {
  res.set('Cache-Control', 'public, max-age=60');
  res.json({ settings: await Settings.getAll() });
}));

router.get('/api/pages', wrap(async (_req, res) => {
  res.json({ pages: await Pages.listPublished() });
}));

router.get('/api/pages/:key', wrap(async (req, res) => {
  const page = await Pages.getPublished(str(req.params.key, 100).toLowerCase());
  if (!page) return res.status(404).json({ error: 'Page not found.' });
  res.set('Cache-Control', 'public, max-age=30');
  res.json({ page });
}));

router.get('/api/seo', wrap(async (req, res) => {
  const path = str(req.query.path, 200) || '/';
  res.set('Cache-Control', 'public, max-age=60');
  res.json({ seo: await Seo.getByPath(path) });
}));

const STATIC = ['/', '/about', '/services', '/projects', '/gallery', '/team', '/testimonials', '/blog', '/contact', '/get-a-quote', '/faqs', '/privacy-policy', '/terms-and-conditions'];
router.get('/sitemap.xml', wrap(async (_req, res) => {
  const site = (process.env.SITE_URL || '').replace(/\/+$/, '');
  const now = new Date();
  const items = await Content.sitemapItems();
  const pages = await Pages.listPublishedKeys();
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
