// Integration tests against a REAL, DISPOSABLE MySQL 8 server. Skipped unless TEST_MYSQL=1.
//   TEST_MYSQL=1 DB_HOST=127.0.0.1 DB_USER=root DB_PASSWORD=... npm test
// The test creates a throw-away database named ivy_test_<timestamp>, applies the migrations, and DROPS it afterwards.
// NEVER point DB_* at a production server with an account that can drop databases.
import test from 'node:test';
import assert from 'node:assert/strict';

const skip = process.env.TEST_MYSQL === '1' ? false : 'TEST_MYSQL=1 not set (needs a disposable MySQL 8 server)';

test('API integration (MySQL)', { skip }, async (t) => {
  const dbName = `ivy_test_${Date.now()}`;
  process.env.DB_NAME = dbName;
  process.env.JWT_SECRET = 'x'.repeat(48);
  process.env.ADMIN_EMAIL = 'admin@test.local';
  process.env.ADMIN_PASSWORD = 'TestPassword123';
  process.env.NODE_ENV = 'test';
  const mysql = (await import('mysql2/promise')).default;
  const { runMigrations } = await import('../scripts/migrateLib.js');
  const { dbConfig } = await import('../lib/env.js');
  const quiet = { log() {}, error() {} };
  await runMigrations({ createDatabase: true, log: quiet });
  const { connectDb, closeDb, assertSchema } = await import('../lib/db.js');
  const { createApp } = await import('../app.js');
  await connectDb(); await assertSchema();
  const server = createApp().listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = (path, opts = {}) => fetch(base + path, { ...opts, headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) }, body: opts.body ? JSON.stringify(opts.body) : undefined });
  t.after(async () => {
    server.close(); await closeDb();
    const root = await mysql.createConnection({ ...dbConfig(), database: undefined });
    await root.query(`DROP DATABASE IF EXISTS \`${dbName}\``); await root.end();
  });

  await t.test('health', async () => { const j = await (await call('/api/health')).json(); assert.equal(j.database, 'connected'); assert.equal(j.engine, 'mysql'); });
  await t.test('admin routes reject anonymous requests', async () => {
    for (const p of ['/api/admin/me', '/api/admin/enquiries', '/api/admin/stats', '/api/content/admin']) assert.equal((await call(p)).status, 401, p);
  });
  let token;
  await t.test('login (bootstrap) + wrong password', async () => {
    assert.equal((await call('/api/admin/login', { method: 'POST', body: { email: 'admin@test.local', password: 'nope' } })).status, 401);
    const r = await call('/api/admin/login', { method: 'POST', body: { email: 'admin@test.local', password: 'TestPassword123' } });
    assert.equal(r.status, 200); const j = await r.json(); token = j.token; assert.ok(token); assert.equal(j.admin.passwordHash, undefined);
  });
  const auth = () => ({ Authorization: `Bearer ${token}` });
  await t.test('content CRUD + publish affects public API', async () => {
    let r = await call('/api/content/admin', { method: 'POST', headers: auth(), body: { type: 'project', title: 'Test Project', image: 'https://example.com/a.jpg', active: false, gallery: ['https://example.com/b.jpg'], meta: { year: '2024' } } });
    assert.equal(r.status, 201); const { item } = await r.json(); const id = item._id; assert.equal(item.slug, 'test-project'); assert.deepEqual(item.gallery, ['https://example.com/b.jpg']);
    assert.equal((await (await call('/api/content?type=project')).json()).items.length, 0);
    r = await call(`/api/content/admin/${id}`, { method: 'PATCH', headers: auth(), body: { active: true } }); assert.equal(r.status, 200);
    assert.equal((await (await call('/api/content/project/test-project')).json()).item.title, 'Test Project');
    const dup = await (await call('/api/content/admin', { method: 'POST', headers: auth(), body: { type: 'project', title: 'Test Project' } })).json();
    assert.equal(dup.item.slug, 'test-project-2');
    assert.equal((await call('/api/content/admin', { method: 'POST', headers: auth(), body: { type: 'project', title: '' } })).status, 400);
    assert.equal((await call('/api/content/admin', { method: 'POST', headers: auth(), body: { type: 'project', title: 'x', image: 'javascript:alert(1)' } })).status, 400);
    assert.equal((await call(`/api/content/admin?type=project&q=${encodeURIComponent("100%_'; DROP TABLE content_items;--")}`, { headers: auth() })).status, 200);
    assert.equal((await call(`/api/content/admin/${id}`, { method: 'DELETE', headers: auth() })).status, 200);
  });
  await t.test('enquiry stored, validated, visible to admin, duplicate-safe, notes + status', async () => {
    const body = { name: 'Asha', phone: '9876543210', message: 'Need a 2BHK interior', source: 'quote' };
    assert.equal((await call('/api/enquiry', { method: 'POST', body })).status, 201);
    assert.equal((await call('/api/enquiry', { method: 'POST', body })).status, 200); // duplicate
    assert.equal((await call('/api/enquiry', { method: 'POST', body: { ...body, phone: '123' } })).status, 400);
    const list = await (await call('/api/admin/enquiries', { headers: auth() })).json();
    assert.equal(list.total, 1);
    const id = list.enquiries[0]._id;
    assert.equal((await call(`/api/admin/enquiries/${id}`, { method: 'PATCH', headers: auth(), body: { status: 'contacted' } })).status, 200);
    const n = await (await call(`/api/admin/enquiries/${id}/notes`, { method: 'POST', headers: auth(), body: { text: 'Called back' } })).json();
    assert.equal(n.enquiry.notes.length, 1); assert.equal(n.enquiry.status, 'contacted');
  });
  await t.test('pages, settings, seo round-trip', async () => {
    let r = await call('/api/admin/pages/home', { method: 'PUT', headers: auth(), body: { title: 'Home', status: 'published', sections: [{ type: 'hero', heading: 'Hi', visible: true }, { type: 'cta', heading: 'Bye', visible: false }] } });
    assert.equal(r.status, 200);
    const pub = await (await call('/api/pages/home')).json(); assert.equal(pub.page.sections.length, 1);
    r = await call('/api/admin/settings', { method: 'PUT', headers: auth(), body: { siteName: 'Ivy', instagram: 'https://instagram.com/x' } }); assert.equal(r.status, 200);
    const st = await (await call('/api/settings')).json(); assert.equal(st.settings.siteName, 'Ivy'); assert.equal(st.settings.instagram, 'https://instagram.com/x');
    r = await call('/api/admin/seo', { method: 'PUT', headers: auth(), body: { path: '/about', title: 'About us' } }); assert.equal(r.status, 200);
    assert.equal((await (await call('/api/seo?path=/about')).json()).seo.title, 'About us');
  });
});
