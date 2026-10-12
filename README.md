# Ivy Interio – website + admin CMS

Vite + React 18 frontend (`/src`) and an Express + Mongoose API (`/server`) backed by MongoDB.
The two parts are deployed **separately** (see Deployment).

> **Read first – verification status.** This version was written in a sandbox with no network access.
> Dependencies were never installed, the Vite build was never run, the API was never started and no MongoDB
> was ever contacted. Only static checks were possible (see *What was actually tested*). Run the commands
> below on your machine before deploying, and expect to fix small issues.

## Project structure
```
.
├── src/                    React frontend
│   ├── App.jsx             routes (public + lazy-loaded /admin/*)
│   ├── pages/              public pages
│   ├── components/         layout, sections, forms, UI
│   ├── hooks/              data + SEO hooks
│   ├── data/seedData.js    default content (also the offline fallback)
│   └── admin/              CMS (dashboard, content, enquiries, pages, SEO, settings, users)
├── server/                 Express API
│   ├── app.js / server.js  app factory / entry point
│   ├── models/             AdminUser, ContentItem, Enquiry, Page, Setting, Seo
│   ├── routes/             admin, content, enquiry, public (settings/pages/seo/sitemap)
│   ├── middleware/         auth + roles, rate limiting
│   ├── scripts/            create-admin, seed, migrate:slugs, check
│   └── test/               integration tests (need a disposable MongoDB)
├── public/                 logo, robots.txt, static sitemap.xml
├── legacy/                 archived old pages (not built; see legacy/README.md)
├── vercel.json             SPA rewrites + security/cache headers (frontend)
└── .env.example, server/.env.example
```

## Prerequisites
Node.js 18.18+ (20 or 22 recommended), npm, a MongoDB database (MongoDB Atlas free tier is fine).

## Install
```bash
npm install                 # frontend
npm run server:install      # backend  (same as: cd server && npm install)
```

## Configure MongoDB (Atlas)
1. Create a cluster, then **Database Access → Add user** (username + strong password, role *readWrite* on your database).
2. **Network Access:** allow your API host. Render/Railway use changing IPs, so Atlas usually needs `0.0.0.0/0` for them; keep the database user's password strong and never commit it.
3. **Connect → Drivers** and copy the `mongodb+srv://…` string. URL-encode special characters in the password.
4. Put it in `server/.env` as `MONGO_URI` and the database name in `MONGO_DB_NAME`
   (use your **existing** database name to keep existing content).
5. Never use your local machine as the production database.

## Environment variables
Copy the examples and fill them in (real `.env` files are git-ignored and are NOT in this ZIP):
```bash
cp server/.env.example server/.env
cp .env.example .env            # optional locally; required in production builds
```
| Where | Variable | Purpose |
|---|---|---|
| server | `MONGO_URI`, `MONGO_DB_NAME`, `MONGO_MAX_POOL_SIZE` | database |
| server | `JWT_SECRET` (≥32 chars), `JWT_EXPIRES_IN` | admin sessions |
| server | `CLIENT_URL` | allowed frontend origin(s), comma-separated, **required in production** |
| server | `SITE_URL` | public site URL used by `/sitemap.xml` |
| server | `PORT`, `TRUST_PROXY` | listening port; `1` behind Render/Railway/Nginx |
| server | `ADMIN_EMAIL`, `ADMIN_PASSWORD` | first-admin bootstrap only |
| server | `CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET/FOLDER` | optional image uploads |
| frontend | `VITE_API_URL` | public URL of the deployed API (build-time) |

Generate a secret: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`

## Initialise the admin account safely
Admins now live in MongoDB (`adminusers`) with bcrypt-hashed passwords.
```bash
cd server
ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='a-long-password-with-1-number' npm run create-admin
```
* It creates the user only if it does not exist; it **never overwrites** an existing password unless you add `--reset-password`.
* Upgrading from the old version: if `ADMIN_EMAIL`/`ADMIN_PASSWORD` are still set and **no** admin exists yet, the first successful login with those credentials creates the admin (hashed). After that, remove `ADMIN_PASSWORD` from your host's settings.
* There is no public registration route. Extra users are added by an admin in *Admin users*.
* Roles: **admin** (everything) and **editor** (content + enquiries; cannot change settings, manage users, delete enquiries/pages).
* Login is rate-limited (10 attempts / 15 min / IP) and accounts lock for 15 min after 5 failures.

## Seed starter content (optional, additive)
```bash
cd server && npm run seed
```
Adds default services, projects, gallery, testimonials, blog posts, team, FAQs, banners, settings and the homepage layout **only for types that have no records yet**. It never deletes or overwrites, and never touches users or enquiries.
`npm run migrate:slugs` adds missing slugs to older services/projects/posts (existing slugs are untouched).
`npm run check` is a read-only connection check.

## Run locally
```bash
# terminal 1
npm run server:dev          # http://localhost:5000  (health: /api/health)
# terminal 2
npm run dev                 # http://localhost:5173  (Vite proxies /api to :5000)
```
Admin: http://localhost:5173/admin

## Build / lint / test
```bash
npm run build               # frontend production build -> dist/
npm run lint
cd server && TEST_MONGO_URI="mongodb://127.0.0.1:27017" npm test   # throw-away DB, dropped afterwards
```

## What changed (summary)
* Real client-side routing for every page (incl. `/residential-interiors`, `/office-interiors`, `/modular-kitchen`, `/bedroom-design`, `/living-room-design`, `/commercial-interiors`, nested project/blog/service routes, `/p/:key` CMS pages, 404). The old 17 page files were unrouted and imported packages that were never installed; they are archived in `legacy/`.
* Public data comes from the API; if the API is unreachable the site shows built-in highlights with a notice.
* CMS: dashboard (live stats), pages & sections (order, visibility, publish), banners, services, projects, gallery, testimonials, blog, team, FAQs, enquiries (search, filters, pagination, status, notes, delete), SEO overrides, settings, admin users, password change.
* Backend: validation + field whitelisting on every write, unique slugs, NoSQL-operator stripping, helmet, restrictive CORS (a blocked origin no longer causes a 500), 503 while the DB is down, rate limiting, server-side role checks on every admin endpoint, consistent `{error}` responses with no stack traces.
* Stale `src/src` and `src/server` folders (older duplicates of the real code) were not carried over.

### Likely cause of the earlier HTTP 500s (not reproduced)
The old API turned a rejected CORS origin into a 500 and the repo's `vercel.json` cannot run an Express server. If the API was on Vercel without a serverless export, or `CLIENT_URL`/origin did not match, content requests would fail. Both are addressed in code, but only a real deployment can confirm it.

## Deployment
**Frontend → Vercel (or Netlify/Cloudflare Pages)**
1. Import the repo, framework *Vite*, root directory = repo root, build `npm run build`, output `dist`.
2. Env var: `VITE_API_URL=https://<your-api-host>` (no trailing slash). Redeploy after changing it.
3. `vercel.json` already rewrites unknown paths to `index.html`, so `/admin` and nested routes survive a refresh.

**Backend → Render / Railway / Fly / a VPS (a persistent Node host)**
Do *not* assume Vercel runs `server/` as a persistent Express server – this project is not adapted to serverless.
* Render: New *Web Service*, root directory `server`, build `npm install`, start `npm start`, health check `/api/health`.
* Set all server variables above. `CLIENT_URL=https://interior-studio-liart.vercel.app` (add your custom domain, comma-separated). `NODE_ENV=production`, `TRUST_PROXY=1`.
* Then run `create-admin` (Render shell or locally with the production `MONGO_URI`) and optionally `seed`.

**Connection pooling:** one long-lived process with `MONGO_MAX_POOL_SIZE` (default 10) is appropriate. Do not run this API as short-lived serverless functions without reworking connection caching.

**Images:** public content currently uses remote Unsplash URLs (already used by the original site) – an external dependency; replace them in the admin with your own photos. For uploads, create a free Cloudinary account and set the three `CLOUDINARY_*` variables. **Uploads are disabled (and the admin says so) until these are set.** The server's own disk is not used because hosting disks are ephemeral.

### SEO
* Per-page titles, descriptions, canonical and Open Graph tags are set client-side (`Seo` component); override any path in *Admin → SEO*; services/projects/posts have their own SEO fields.
* `public/robots.txt` and `public/sitemap.xml` are static (static routes only, domain hard-coded to the Vercel URL – edit if you use another domain). A dynamic sitemap incl. published services/projects/posts is served by the API at `/sitemap.xml`; to publish it on the frontend domain add a Vercel rewrite `{"source":"/sitemap.xml","destination":"https://<api-host>/sitemap.xml"}` before the SPA rewrite and delete `public/sitemap.xml`.
* Limitation: it is a client-rendered SPA; crawlers that do not run JavaScript only see the default `index.html` tags. Server-side rendering/prerendering would be the next step.

## What was actually tested
| Check | Result |
|---|---|
| JS/JSX syntax of all frontend files (TypeScript parser, `--noResolve`) | **Passed** |
| `node --check` on all backend files | **Passed** |
| All relative imports/named exports in `src/` and `server/` resolve (custom script) | **Passed** |
| Validation helpers (slugify, URL checks, NoSQL operator stripping, meta/SEO cleaning) with a stubbed `mongoose` | **Passed** |
| Integration test file runs | **Skipped** (needs `TEST_MONGO_URI`) |
| `npm install` (frontend + server) | **Not run** (no network) |
| `npm run build`, `npm run lint` | **Not run** |
| API start-up, `/api/health`, login, protected routes, CRUD, enquiry flow, publish→public | **Not run** |
| MongoDB connection, index creation, seed, create-admin | **Not run** |
| Cloudinary upload | **Not run / not configured** |
| Browser rendering, responsiveness, animations, accessibility audit, console errors | **Not run** |
| Production deployment | **Not verified** |

## Known limitations / to verify
* Package versions were chosen from memory and never resolved; if `npm install` complains, bump them.
* ESLint config is written for ESLint 9 flat config; unrun, so warnings are possible.
* Existing live documents have no `slug`; run `npm run migrate:slugs` (or edit them in the admin). Until then detail URLs fall back to the record id.
* Types introduced in v2 (team, FAQ, banner) show built-in defaults until you create/seed your own.
* Changing the seed data: edit `server/scripts/seedData.js` then `npm run sync-seed` to refresh the frontend copy.
* Admin token is kept in `sessionStorage` (cleared when the tab closes); a strict CSP is recommended once the final domains are known.
* Rotate any credentials that were in the `.env` file inside the ZIP originally supplied to me.
