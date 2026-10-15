// Read-only connectivity + schema check:  npm run check
import '../lib/env.js';
import { connectDb, assertSchema, closeDb, friendlyDbError, query } from '../lib/db.js';

try {
  await connectDb();
  const [{ v, db }] = await query('SELECT VERSION() AS v, DATABASE() AS db');
  console.log(`MySQL connection OK (version ${v}, database ${db})`);
  await assertSchema();
  const n = async (t) => (await query(`SELECT COUNT(*) AS n FROM ${t}`))[0].n;
  console.log('Schema OK. Admin users:', await n('admin_users'), '| Content rows:', await n('content_items'), '| Enquiries:', await n('enquiries'));
} catch (e) { console.error(`Check FAILED: ${friendlyDbError(e)}`); process.exitCode = 1; }
await closeDb();
