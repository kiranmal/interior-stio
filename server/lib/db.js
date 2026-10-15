import mysql from 'mysql2/promise';
import { dbConfig } from './env.js';

export const REQUIRED_TABLES = ['admin_users', 'content_items', 'enquiries', 'enquiry_notes', 'pages', 'page_sections', 'site_settings', 'social_links', 'seo_entries', 'schema_migrations'];

let pool = null;
let ready = false;
let monitor = null;

export function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      ...dbConfig(),
      waitForConnections: true,
      connectionLimit: Number(process.env.DB_POOL_SIZE) || 10,
      queueLimit: 0,
      charset: 'utf8mb4',
      timezone: 'Z',            // Date <-> DATETIME conversions are done in UTC
      decimalNumbers: true,     // DECIMAL columns come back as numbers
      enableKeepAlive: true,
      connectTimeout: 10000,
      multipleStatements: false,
    });
    pool.on('connection', (c) => c.query("SET time_zone = '+00:00'"));
  }
  return pool;
}

export const dbReady = () => ready;

/** Parameterised query (values are escaped by the driver, never string-concatenated). Returns rows / ResultSetHeader. */
export async function query(sql, params = []) {
  const [rows] = await getPool().query(sql, params);
  return rows;
}

/** Run fn(tx) inside a transaction; tx.query has the same signature as query(). */
export async function tx(fn) {
  const conn = await getPool().getConnection();
  try {
    await conn.beginTransaction();
    const result = await fn({ query: async (sql, params = []) => (await conn.query(sql, params))[0] });
    await conn.commit();
    return result;
  } catch (e) {
    try { await conn.rollback(); } catch { /* connection already gone */ }
    throw e;
  } finally { conn.release(); }
}

export async function missingTables() {
  const rows = await query('SELECT table_name AS t FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name IN (?)', [REQUIRED_TABLES]);
  const have = new Set(rows.map((r) => String(r.t).toLowerCase()));
  return REQUIRED_TABLES.filter((t) => !have.has(t));
}

/** Throws a clear error when the schema has not been created. */
export async function assertSchema() {
  const missing = await missingTables();
  if (missing.length) {
    const e = new Error(`Database "${process.env.DB_NAME}" is missing required table(s): ${missing.join(', ')}. Run "npm run db:migrate" in /server first.`);
    e.code = 'SCHEMA_MISSING';
    throw e;
  }
}

export async function connectDb() {
  await query('SELECT 1');
  ready = true;
}

export function friendlyDbError(e) {
  const map = {
    ECONNREFUSED: 'Cannot reach the MySQL server (connection refused). Check DB_HOST / DB_PORT and that MySQL is running.',
    ENOTFOUND: 'MySQL host name could not be resolved. Check DB_HOST.',
    ETIMEDOUT: 'Connection to MySQL timed out. Check DB_HOST, DB_PORT and firewall / allow-list rules.',
    ER_ACCESS_DENIED_ERROR: 'MySQL rejected the user name or password. Check DB_USER / DB_PASSWORD.',
    ER_BAD_DB_ERROR: `Database "${process.env.DB_NAME}" does not exist. Create it (or run "npm run db:create").`,
    HANDSHAKE_SSL_ERROR: 'TLS handshake with MySQL failed. Check DB_SSL / DB_SSL_REJECT_UNAUTHORIZED.',
  };
  return map[e?.code] || e?.message || String(e);
}

/** Keeps retrying in the background so the API reports 503 (never fake data) until MySQL is reachable. */
export function connectWithRetry(log = console, onConnected) {
  const attempt = async () => {
    try {
      await connectDb();
      await assertSchema();
      log.log('MySQL connected, schema OK');
      if (!monitor) {
        monitor = setInterval(async () => { try { await query('SELECT 1'); ready = true; } catch { ready = false; } }, 15000);
        monitor.unref?.();
      }
      if (onConnected) { try { await onConnected(); } catch (e) { log.error('Post-connect task failed:', friendlyDbError(e)); } }
    } catch (e) {
      ready = false;
      if (e.code === 'SCHEMA_MISSING') { log.error(e.message); process.exit(1); } // fail loudly, do not limp along
      log.error(`MySQL connection failed (retrying in 5s): ${friendlyDbError(e)}`);
      setTimeout(attempt, 5000);
    }
  };
  return attempt();
}

export async function closeDb() {
  if (monitor) clearInterval(monitor);
  if (pool) { await pool.end(); pool = null; }
  ready = false;
}
