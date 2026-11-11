// Creates the first admin. Never overwrites an existing user's password unless you pass --reset-password.
//   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='long-password-1' npm run create-admin
import '../lib/env.js';
import bcrypt from 'bcryptjs';
import { connectDb, assertSchema, closeDb, friendlyDbError } from '../lib/db.js';
import * as AdminUsers from '../models/adminUsers.js';
import { passwordProblem } from '../routes/admin.js';

const email = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD || '';
const reset = process.argv.includes('--reset-password');
if (!email || !/^\S+@\S+\.\S+$/.test(email)) { console.error('Set ADMIN_EMAIL to a valid email.'); process.exit(1); }
const problem = passwordProblem(password);
if (problem) { console.error(problem); process.exit(1); }

try {
  await connectDb(); await assertSchema();
  const existing = await AdminUsers.findByEmail(email);
  if (existing && !reset) console.log(`Admin ${email} already exists. Nothing changed. (Use --reset-password to change its password.)`);
  else if (existing) { await AdminUsers.update(existing.id, { passwordHash: await bcrypt.hash(password, 12), active: true, failedLogins: 0, lockUntil: null }); console.log(`Password reset for ${email}.`); }
  else { await AdminUsers.create({ email, name: 'Administrator', role: 'admin', passwordHash: await bcrypt.hash(password, 12) }); console.log(`Admin ${email} created.`); }
} catch (e) { console.error(`create-admin FAILED: ${friendlyDbError(e)}`); process.exitCode = 1; }
await closeDb();
