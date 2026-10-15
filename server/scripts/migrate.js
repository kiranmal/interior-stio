// Creates / upgrades the MySQL schema.   npm run db:migrate   |   npm run db:create (also CREATE DATABASE)   |   npm run db:status
import '../lib/env.js';
import { runMigrations, migrationStatus } from './migrateLib.js';
import { friendlyDbError } from '../lib/db.js';

try {
  if (process.argv.includes('--status')) console.table(await migrationStatus());
  else await runMigrations({ createDatabase: process.argv.includes('--create-database') });
} catch (e) {
  console.error(`\nMigration FAILED: ${friendlyDbError(e)}`);
  process.exit(1);
}
