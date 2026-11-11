import { query } from '../lib/db.js';
import { nn, likeTerm } from './util.js';

export const ENQUIRY_STATUSES = ['new', 'contacted', 'discussion', 'site-visit', 'converted', 'closed'];
export const ENQUIRY_SOURCES = ['contact-form', 'cost-calculator', 'quote'];

const map = (r, notes) => ({
  _id: String(r.id), id: String(r.id), name: r.name, phone: r.phone, email: nn(r.email), city: nn(r.city), service: nn(r.service), message: nn(r.message),
  source: r.source, propertyType: nn(r.property_type), area: nn(r.area), quality: nn(r.quality), budget: nn(r.budget),
  estimatedLower: nn(r.estimated_lower), estimatedUpper: nn(r.estimated_upper), status: r.status,
  ...(notes ? { notes: notes.map((n) => ({ text: n.text, by: n.created_by, at: n.created_at })) } : {}),
  createdAt: r.created_at, updatedAt: r.updated_at,
});

export async function create(d) {
  const res = await query(
    `INSERT INTO enquiries (name, phone, email, city, service, message, source, property_type, area, quality, budget, estimated_lower, estimated_upper)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [d.name, d.phone, d.email || null, d.city || null, d.service || null, d.message || null, d.source, d.propertyType || null, d.area ?? null,
      d.quality || null, d.budget || null, d.estimatedLower ?? null, d.estimatedUpper ?? null],
  );
  return String(res.insertId);
}

export async function isDuplicate({ phone, source, message }) {
  const rows = await query('SELECT 1 FROM enquiries WHERE phone = ? AND source = ? AND (message <=> ?) AND created_at >= ? LIMIT 1', [phone, source, message || null, new Date(Date.now() - 10 * 60 * 1000)]);
  return rows.length > 0;
}

export async function list({ q, status, source, from, to, limit, page }) {
  const where = ['1=1']; const params = [];
  if (q) { const t = likeTerm(q); where.push("(name LIKE ? ESCAPE '\\\\' OR phone LIKE ? ESCAPE '\\\\' OR email LIKE ? ESCAPE '\\\\' OR city LIKE ? ESCAPE '\\\\' OR message LIKE ? ESCAPE '\\\\')"); params.push(t, t, t, t, t); }
  if (status) { where.push('status = ?'); params.push(status); }
  if (source) { where.push('source = ?'); params.push(source); }
  if (from) { where.push('created_at >= ?'); params.push(from); }
  if (to) { where.push('created_at <= ?'); params.push(to); }
  const w = where.join(' AND ');
  const [rows, count] = await Promise.all([
    query(`SELECT * FROM enquiries WHERE ${w} ORDER BY created_at DESC, id DESC LIMIT ? OFFSET ?`, [...params, limit, (page - 1) * limit]),
    query(`SELECT COUNT(*) AS n FROM enquiries WHERE ${w}`, params),
  ]);
  return { enquiries: rows.map((r) => map(r)), total: count[0].n };
}

export async function get(id) {
  const rows = await query('SELECT * FROM enquiries WHERE id = ? LIMIT 1', [id]);
  if (!rows.length) return null;
  const notes = await query('SELECT text, created_by, created_at FROM enquiry_notes WHERE enquiry_id = ? ORDER BY created_at ASC, id ASC', [id]);
  return map(rows[0], notes);
}

export async function setStatus(id, status) {
  const res = await query('UPDATE enquiries SET status = ? WHERE id = ?', [status, id]);
  return res.affectedRows ? get(id) : null; // affectedRows counts matched rows by default in mysql2
}

export async function addNote(id, text, by) {
  const exists = await query('SELECT 1 FROM enquiries WHERE id = ? LIMIT 1', [id]);
  if (!exists.length) return null;
  await query('INSERT INTO enquiry_notes (enquiry_id, text, created_by) VALUES (?, ?, ?)', [id, text, by]);
  return get(id);
}

export async function remove(id) { return (await query('DELETE FROM enquiries WHERE id = ?', [id])).affectedRows > 0; } // notes cascade

export async function count() { return (await query('SELECT COUNT(*) AS n FROM enquiries'))[0].n; }

export async function stats() {
  const since7 = new Date(Date.now() - 7 * 864e5); const since30 = new Date(Date.now() - 30 * 864e5);
  const [total, byStatus, bySource, d7, d30, recent] = await Promise.all([
    query('SELECT COUNT(*) AS n FROM enquiries'),
    query('SELECT status AS k, COUNT(*) AS n FROM enquiries GROUP BY status'),
    query('SELECT source AS k, COUNT(*) AS n FROM enquiries GROUP BY source'),
    query('SELECT COUNT(*) AS n FROM enquiries WHERE created_at >= ?', [since7]),
    query('SELECT COUNT(*) AS n FROM enquiries WHERE created_at >= ?', [since30]),
    query('SELECT id, name, phone, service, source, status, created_at FROM enquiries ORDER BY created_at DESC, id DESC LIMIT 6'),
  ]);
  const toMap = (rows) => Object.fromEntries(rows.map((r) => [r.k, r.n]));
  return {
    total: total[0].n, last7: d7[0].n, last30: d30[0].n, byStatus: toMap(byStatus), bySource: toMap(bySource),
    recentEnquiries: recent.map((r) => ({ _id: String(r.id), name: r.name, phone: r.phone, service: r.service, source: r.source, status: r.status, createdAt: r.created_at })),
  };
}
