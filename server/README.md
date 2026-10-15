# Ivy Interio API (MySQL 8)
See the root README. Quick start: `cp .env.example .env && npm install && npm run db:migrate && npm run create-admin && npm run dev`.
Public: `GET /api/health, /api/content?type=, /api/content/:type/:slug, /api/settings, /api/pages/:key, /api/seo?path=, /sitemap.xml`, `POST /api/enquiry`.
Admin (Bearer token): `/api/admin/*` and `/api/content/admin*`.
