// Safe, repeatable seed (additive only).   Usage: npm run db:seed
import '../lib/env.js';
import { connectDb, assertSchema, closeDb, friendlyDbError } from '../lib/db.js';
import { seedMissing } from './seedLib.js';

try {
  await connectDb(); await assertSchema();
  console.log(`Done. ${await seedMissing()} row(s) added.`);
} catch (e) { console.error(`Seed FAILED: ${friendlyDbError(e)}`); process.exitCode = 1; }
await closeDb();
