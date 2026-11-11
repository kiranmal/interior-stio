import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mysql from 'mysql2/promise';
import { dbConfig } from '../lib/env.js';
import { friendlyDbError } from '../lib/db.js';

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'migrations');
export const migrationFiles = () => fs.readdirSync(dir).filter((f) => /^\d+_.+\.sql$/.test(f)).sort();

/** Applies pending .sql files in order and records them in schema_migrations. Throws with a clear message on failure. */
export async function runMigrations({ createDatabase = false, log = console, config } = {}) {
  const base = config || dbConfig();
  if (!base.host || !base.user || !base.database) throw new Error('DB_HOST, DB_USER and DB_NAME must be set (see server/.env.example).');
  let conn;
  try {
    if (createDatabase) {
      if (!/^[A-Za-z0-9_]+$/.test(base.database)) throw new Error('DB_NAME may only contain letters, numbers and underscores when using --create-database.');
      const root = await mysql.createConnection({ ...base, database: undefined });
      await root.query(`CREATE DATABASE IF NOT EXISTS \`${base.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
      await root.end();
      log.log(`Database ${base.database} ensured.`);
    }
    conn = await mysql.createConnection({ ...base, multipleStatements: true, charset: 'utf8mb4' });
  } catch (e) { throw new Error(`Cannot connect to MySQL: ${friendlyDbError(e)}`); }

  try {
    const [[{ v }]] = await conn.query('SELECT VERSION() AS v');
    log.log(`Connected to MySQL ${v}`);
    if (/^[0-4]\.|^5\.[0-6]/.test(v)) throw new Error(`MySQL ${v} is too old; MySQL 8 is required (JSON columns, utf8mb4).`);
    await conn.query(`CREATE TABLE IF NOT EXISTS schema_migrations (
      version VARCHAR(120) NOT NULL, applied_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3), PRIMARY KEY (version)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
    const [done] = await conn.query('SELECT version FROM schema_migrations');
    const applied = new Set(done.map((r) => r.version));
    let n = 0;
    for (const file of migrationFiles()) {
      if (applied.has(file)) { log.log(`- ${file} already applied`); continue; }
      log.log(`+ applying ${file} ...`);
      await conn.query(fs.readFileSync(path.join(dir, file), 'utf8')); // DDL auto-commits in MySQL; recorded only on success
      await conn.query('INSERT INTO schema_migrations (version) VALUES (?)', [file]);
      n += 1;
    }
    log.log(n ? `Applied ${n} migration(s).` : 'Database schema is up to date.');
    return n;
  } finally { await conn.end(); }
}

export async function migrationStatus(config) {
  const conn = await mysql.createConnection(config || dbConfig());
  try {
    let applied = [];
    try { [applied] = await conn.query('SELECT version, applied_at FROM schema_migrations ORDER BY version'); } catch { /* table not created yet */ }
    const have = new Set(applied.map((r) => r.version));
    return migrationFiles().map((f) => ({ file: f, applied: have.has(f) }));
  } finally { await conn.end(); }
}
