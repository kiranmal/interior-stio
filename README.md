# Ivy Interio – website + admin CMS (MySQL 8 edition)

Vite + React 18 frontend (`/src`) and an Express API (`/server`) backed by **MySQL 8** through `mysql2/promise`
(connection pool, parameterised queries). The two parts are deployed **separately**.

> **Read first – verification status.** This conversion was written in a sandbox with **no network and no MySQL server**.
> Dependencies were never installed, the Vite build was never run, the API was never started, and no SQL was ever
> executed. Only static checks were possible (see *What was actually tested*). Run the commands below on your machine
> and expect to fix small issues before going live.

## Project structure
```
.
├── src/                      React frontend (unchanged by the MySQL migration)
├── server/
│   ├── app.js / server.js    app factory / entry point
│   ├── lib/                  db.js (pool, tx, schema check), env.js, validate.js, cloudinary.js
│   ├── migrations/           001_initial_schema.sql  (authoritative schema)
│   ├── sql/schema.sql        same schema as a single file for manual import (phpMyAdmin etc.)
│   ├── models/               SQL data-access modules (content, enquiries, pages, settings, seo, adminUsers)
│   ├── routes/               admin, content, enquiry, public   (URLs and JSON shapes unchanged)
│   ├── middleware/           auth + roles, rate limiting
│   ├── scripts/              migrate, seed, createAdmin, migrateSlugs, check, importMongoJson
│   └── test/                 integration tests (need a disposable MySQL 8)
├── public/  legacy/  vercel.json  .env.example  server/.env.example
```

## Prerequisites
Node.js 18.18+ (20/22 recommended), npm, **MySQL 8.0+** (utf8mb4, InnoDB, JSON type).

## Install and initialise
```bash
npm install
npm run server:install
cp server/.env.example server/.env        # then edit DB_* and JWT_SECRET
```
Create a database and a dedicated user once (as a MySQL admin):
```sql
CREATE DATABASE ivy_interio CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'ivy_user'@'%' IDENTIFIED BY 'a-strong-password';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, INDEX, REFERENCES ON ivy_interio.* TO 'ivy_user'@'%';
```
(Or let the tool do `CREATE DATABASE` if your user may: `npm --prefix server run db:create`.)

```bash
cd server
npm run db:migrate          # creates/updates all tables; fails with a clear message if MySQL is unreachable
npm run db:status           # shows which migrations are applied
npm run check               # read-only: connection + required tables + row counts
ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='a-long-password-with-1-number' npm run create-admin
npm run db:seed             # optional starter content (additive only)
```
* `db:migrate` stops with exit code 1 and a plain-English reason (wrong host, access denied, unknown database, TLS, MySQL < 8).
* The API **refuses to start** (exit 1) if required tables are missing, and answers **503** (never mock data) while MySQL is unreachable.
* A strict production user does not need `CREATE/ALTER/INDEX`; run migrations with a more privileged user, then run the API with a `SELECT, INSERT, UPDATE, DELETE` user.

## Tables
| Table | Purpose |
|---|---|
| `admin_users` | admins/editors, bcrypt hash, role, active flag, failed-login counter + lockout time |
| `content_items` | services, projects, gallery, testimonials, blog posts, team, FAQs, banners (`type` column; same single-table design as before) with JSON columns for gallery/tags/meta/seo, unique `(type, slug)` |
| `enquiries` | contact / quote / calculator leads |
| `enquiry_notes` | internal notes per enquiry (FK → `enquiries`, cascade delete) |
| `pages`, `page_sections` | CMS pages and their ordered sections (FK cascade) |
| `site_settings` | key/value global settings (name, contact, address, footer, logo, favicon, default SEO) |
| `social_links` | one row per social platform |
| `seo_entries` | per-path SEO overrides |
| `schema_migrations` | applied migrations |

The previous app had no separate session, token-blacklist or password-reset collections (JWT only), so no tables were invented for them.

## Environment variables
| Where | Variable | Purpose |
|---|---|---|
| server | `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | MySQL connection |
| server | `DB_POOL_SIZE` | pool size (default 10) |
| server | `DB_SSL`, `DB_SSL_REJECT_UNAUTHORIZED` | TLS for managed databases (keep verification on) |
| server | `JWT_SECRET` (≥32 chars), `JWT_EXPIRES_IN` | admin sessions |
| server | `CLIENT_URL` | allowed frontend origin(s), comma-separated; **required in production** |
| server | `SITE_URL`, `PORT`, `TRUST_PROXY` | sitemap domain, port, proxy hops (`1` on Render/Railway) |
| server | `ADMIN_EMAIL`, `ADMIN_PASSWORD` | first-admin bootstrap only |
| server | `AUTO_SEED` | `false` disables additive start-up seeding |
| server | `CLOUDINARY_*` | optional image uploads |
| frontend | `VITE_API_URL` | public URL of the API (build-time) |

Real `.env` files are git-ignored and are not in this ZIP. Generate a secret with
`node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`.

## Admin accounts
Admins live in `admin_users` with bcrypt hashes. `create-admin` never overwrites an existing user unless you add `--reset-password`.
If no admin exists yet, the first successful login with `ADMIN_EMAIL`/`ADMIN_PASSWORD` creates it (hashed); then remove `ADMIN_PASSWORD` from the host.
There is no public registration route. Login is rate-limited (10 / 15 min / IP) and accounts lock for 15 min after 5 failures. Roles: **admin** (all) and **editor** (content + enquiries).

## Seeding
`npm run db:seed` and the optional start-up sync only fill content types that have **no rows**; they never update or delete, and never touch users or enquiries.
Run twice and nothing is duplicated. Edit `server/scripts/seedData.js`, then `npm run sync-seed` (root) to refresh the frontend's offline copy.

## Moving your existing MongoDB data (optional)
Nothing is read from MongoDB at runtime. To carry old content/enquiries over once:
```bash
mongoexport --uri="<old uri>" --collection=contentitems --jsonArray --out=contentitems.json
mongoexport --uri="<old uri>" --collection=enquiries    --jsonArray --out=enquiries.json
cd server && npm run db:import-mongo -- ../contentitems.json ../enquiries.json
```
It is additive and skips rows that already exist. Test on a copy of the database first. Old admin users are not imported (use `create-admin`).
Old documents without slugs get them via `npm run migrate:slugs`.

## Run locally
```bash
npm run server:dev     # API on :5000  (health: /api/health)
npm run dev            # site on :5173 (Vite proxies /api)
```
Admin: http://localhost:5173/admin

## Build / lint / test
```bash
npm run build && npm run lint
cd server && TEST_MYSQL=1 DB_HOST=127.0.0.1 DB_USER=root DB_PASSWORD=... npm test   # creates and drops ivy_test_<timestamp>
```

## Deployment
**Frontend (Vercel/Netlify/Cloudflare Pages):** build `npm run build`, output `dist`, env `VITE_API_URL=https://<api-host>`. `vercel.json` rewrites deep links such as `/admin` to `index.html`.

**API (Render / Railway / Fly / VPS – a persistent Node host; not Vercel serverless):** root `server`, build `npm install`, start `npm start`, health check `/api/health`.
Set `DB_*`, `JWT_SECRET`, `CLIENT_URL=https://interior-studio-liart.vercel.app`, `NODE_ENV=production`, `TRUST_PROXY=1`. Run `npm run db:migrate` and `npm run create-admin` once (pre-deploy command, shell, or locally with the production `DB_*`).

**MySQL hosting:** use a managed MySQL 8 (e.g. Aiven, DigitalOcean, AWS RDS/Aurora MySQL, Azure Database for MySQL, Railway MySQL, your host's MySQL 8). Allow the API host's IP in the database firewall, enable `DB_SSL=true` where TLS is required, and keep `DB_POOL_SIZE` below the plan's connection limit. Never use your own computer as the production database. Back up before running migrations.

**Images:** public content uses remote Unsplash URLs (external dependency). Uploads are disabled until the `CLOUDINARY_*` variables are set.

**SEO:** `public/robots.txt` and `public/sitemap.xml` are static; the API serves a fuller `/sitemap.xml` (see earlier notes: add a rewrite on the frontend host to publish it). The site is client-rendered, so non-JS crawlers see only default tags.

## What was actually tested
| Check | Result |
|---|---|
| JS/JSX syntax of all frontend files (TypeScript parser) | **Passed** (previous build; frontend unchanged except two small hooks) |
| `node --check` on all 40+ backend files | **Passed** |
| All relative imports / named exports resolve (custom script) | **Passed** |
| Every column in every `INSERT` list and the content field map exists in `001_initial_schema.sql`; every FK target exists | **Passed** (script) |
| No MongoDB/Mongoose imports, connections or env vars remain (grep) | **Passed** (only comments, docs and the driver-free JSON import script mention MongoDB) |
| `npm install`, `npm run build`, `npm run lint` | **Not run** (no network) |
| Running the migration against MySQL 8, seed, create-admin | **Not run** (no MySQL) |
| SQL syntax validated by a real MySQL parser | **Not run** (none available offline) |
| API start-up, login, protected routes, CRUD, enquiries, pages/settings/SEO, public content | **Not run** |
| Integration tests (`server/test/api.test.js`, rewritten for MySQL) | **Written, skipped** (needs `TEST_MYSQL=1` and a disposable MySQL 8) |
| Browser rendering, accessibility, production deployment | **Not run / not verified** |

## Known limitations / manual steps
* All SQL is unexecuted: the first `db:migrate` and first API start are the real tests. `VALUES()` in `ON DUPLICATE KEY UPDATE` is deprecated (warning only) on MySQL 8.0.20+ but still works.
* Package versions (`mysql2 ^3.11`, etc.) were chosen from memory and never resolved.
* IDs are now numeric strings (`"12"`) in the JSON API under the same `_id` field, so the frontend needs no change; old Mongo ObjectId links will not resolve.
* Mongo `Mixed` fields (`meta`) are stored as JSON and still limited to flat string/number/boolean values.
* Rotate any credentials that were in the very first `.env` you supplied.
