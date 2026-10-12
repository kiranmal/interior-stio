// Integration tests. They need a REAL, DISPOSABLE MongoDB and are skipped otherwise:
//   TEST_MONGO_URI="mongodb://127.0.0.1:27017" npm test
// Uses a throw-away database name and drops it afterwards. NEVER point this at production data.
import test from 'node:test';
import assert from 'node:assert/strict';

const uri = process.env.TEST_MONGO_URI;
const skip = uri ? false : 'TEST_MONGO_URI not set (needs a disposable MongoDB)';

test('API integration', { skip }, async (t) => {
  process.env.MONGO_URI = uri;
  process.env.MONGO_DB_NAME = `ivy_test_${Date.now()}`;
  process.env.JWT_SECRET = 'x'.repeat(48);
  process.env.ADMIN_EMAIL = 'admin@test.local';
  process.env.ADMIN_PASSWORD = 'TestPassword123';
  process.env.NODE_ENV = 'test';
  const { connectDb } = await import('../lib/db.js');
  const mongoose = (await import('mongoose')).default;
  const { createApp } = await import('../app.js');
  await connectDb();
  const server = createApp().listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = (path, opts = {}) => fetch(base + path, { ...opts, headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) }, body: opts.body ? JSON.stringify(opts.body) : undefined });
  t.after(async () => { server.close(); await mongoose.connection.dropDatabase(); await mongoose.disconnect(); });

  await t.test('health', async () => { const r = await call('/api/health'); assert.equal((await r.json()).database, 'connected'); });
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
  let id;
  await t.test('content CRUD + publish affects public API', async () => {
    let r = await call('/api/content/admin', { method: 'POST', headers: auth(), body: { type: 'project', title: 'Test Project', image: 'https://example.com/a.jpg', active: false } });
    assert.equal(r.status, 201); const { item } = await r.json(); id = item._id; assert.equal(item.slug, 'test-project');
    assert.equal((await (await call('/api/content?type=project')).json()).items.length, 0);
    r = await call(`/api/content/admin/${id}`, { method: 'PATCH', headers: auth(), body: { active: true } }); assert.equal(r.status, 200);
    assert.equal((await (await call('/api/content/project/test-project')).json()).item.title, 'Test Project');
    assert.equal((await call('/api/content/admin', { method: 'POST', headers: auth(), body: { type: 'project', title: '' } })).status, 400);
    assert.equal((await call('/api/content/admin', { method: 'POST', headers: auth(), body: { type: 'project', title: 'x', image: 'javascript:alert(1)' } })).status, 400);
    assert.equal((await call(`/api/content/admin/${id}`, { method: 'DELETE', headers: auth() })).status, 200);
  });
  await t.test('enquiry stored, validated, visible to admin, duplicate-safe', async () => {
    const body = { name: 'Asha', phone: '9876543210', message: 'Need a 2BHK interior', source: 'quote' };
    assert.equal((await call('/api/enquiry', { method: 'POST', body })).status, 201);
    assert.equal((await call('/api/enquiry', { method: 'POST', body })).status, 200); // duplicate
    assert.equal((await call('/api/enquiry', { method: 'POST', body: { ...body, phone: '123' } })).status, 400);
    const list = await (await call('/api/admin/enquiries', { headers: auth() })).json();
    assert.equal(list.total, 1);
  });
});
