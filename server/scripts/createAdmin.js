// Creates the first admin. Never overwrites an existing user's password unless you pass --reset-password.
//   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='long-password-1' npm run create-admin
import '../lib/env.js';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDb } from '../lib/db.js';
import AdminUser from '../models/AdminUser.js';
import { passwordProblem } from '../routes/admin.js';

const email = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD || '';
const reset = process.argv.includes('--reset-password');
if (!process.env.MONGO_URI) { console.error('MONGO_URI is not set.'); process.exit(1); }
if (!email || !/^\S+@\S+\.\S+$/.test(email)) { console.error('Set ADMIN_EMAIL to a valid email.'); process.exit(1); }
const problem = passwordProblem(password);
if (problem) { console.error(problem); process.exit(1); }

await connectDb();
const existing = await AdminUser.findOne({ email }).select('+passwordHash');
if (existing && !reset) console.log(`Admin ${email} already exists. Nothing changed. (Use --reset-password to change its password.)`);
else if (existing) { existing.passwordHash = await bcrypt.hash(password, 12); existing.active = true; await existing.save(); console.log(`Password reset for ${email}.`); }
else { await AdminUser.create({ email, name: 'Administrator', role: 'admin', passwordHash: await bcrypt.hash(password, 12) }); console.log(`Admin ${email} created.`); }
await mongoose.disconnect();
