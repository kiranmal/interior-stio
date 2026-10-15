import jwt from 'jsonwebtoken';
import * as AdminUsers from '../models/adminUsers.js';
import { isId } from '../lib/validate.js';

const rank = { editor: 1, admin: 2 };

/** Verifies the bearer token AND re-loads the user so disabled/deleted admins lose access immediately. */
export default async function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) return res.status(401).json({ error: 'Authentication required.' });
  let payload;
  try { payload = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] }); }
  catch { return res.status(401).json({ error: 'Session expired. Please log in again.' }); }
  if (!isId(payload.sub)) return res.status(401).json({ error: 'Invalid session.' });
  try {
    const user = await AdminUsers.findById(payload.sub);
    if (!user || !user.active) return res.status(401).json({ error: 'Account is not active.' });
    req.admin = { id: user.id, email: user.email, name: user.name, role: user.role };
    next();
  } catch (e) { next(e); }
}

export const requireRole = (min) => (req, res, next) => {
  if ((rank[req.admin?.role] || 0) < rank[min]) return res.status(403).json({ error: 'You do not have permission to do that.' });
  next();
};
