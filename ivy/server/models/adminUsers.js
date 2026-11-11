import { query } from '../lib/db.js';
import { nn } from './util.js';

const map = (r) => r && ({
  _id: String(r.id), id: String(r.id), email: r.email, name: r.name, role: r.role, active: Boolean(r.active),
  passwordHash: r.password_hash, failedLogins: r.failed_logins, lockUntil: nn(r.lock_until), lastLoginAt: nn(r.last_login_at), createdAt: r.created_at,
});
export const publicUser = (u) => ({ id: u.id, email: u.email, name: u.name, role: u.role });

export async function count() { return (await query('SELECT COUNT(*) AS n FROM admin_users'))[0].n; }
export async function findByEmail(email) { return map((await query('SELECT * FROM admin_users WHERE email = ? LIMIT 1', [email]))[0]); } // includes hash: internal use only
export async function findById(id) { return map((await query('SELECT * FROM admin_users WHERE id = ? LIMIT 1', [id]))[0]); }
export async function list() { return (await query('SELECT * FROM admin_users ORDER BY created_at ASC, id ASC')).map((r) => { const u = map(r); delete u.passwordHash; return u; }); }
export async function create({ email, name, role, passwordHash }) {
  const res = await query('INSERT INTO admin_users (email, name, role, password_hash) VALUES (?, ?, ?, ?)', [email, name, role, passwordHash]);
  return findById(res.insertId);
}
const FIELD = { name: 'name', role: 'role', active: 'active', passwordHash: 'password_hash', failedLogins: 'failed_logins', lockUntil: 'lock_until', lastLoginAt: 'last_login_at' };
export async function update(id, patch) {
  const cols = Object.keys(patch).filter((k) => FIELD[k]);
  if (cols.length) await query(`UPDATE admin_users SET ${cols.map((k) => `${FIELD[k]} = ?`).join(', ')} WHERE id = ?`, [...cols.map((k) => (k === 'active' ? (patch[k] ? 1 : 0) : patch[k] ?? null)), id]);
  return findById(id);
}
export async function remove(id) { return (await query('DELETE FROM admin_users WHERE id = ?', [id])).affectedRows > 0; }
