# Ivy Interio API
See the root README for setup. Quick start: `cp .env.example .env && npm install && npm run create-admin && npm run dev`.
Public: `GET /api/health, /api/content?type=, /api/content/:type/:slug, /api/settings, /api/pages/:key, /api/seo?path=, /sitemap.xml`, `POST /api/enquiry`.
Admin (Bearer token): everything under `/api/admin/*` and `/api/content/admin*`.
