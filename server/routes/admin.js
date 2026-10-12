import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import multer from 'multer';
import AdminUser from '../models/AdminUser.js';
import Enquiry, { ENQUIRY_STATUSES, ENQUIRY_SOURCES } from '../models/Enquiry.js';
import ContentItem from '../models/ContentItem.js';
import Page, { SECTION_TYPES } from '../models/Page.js';
import Setting from '../models/Setting.js';
import Seo from '../models/Seo.js';
import auth, { requireRole } from '../middleware/auth.js';
import { loginLimiter, adminLimiter } from '../middleware/rateLimit.js';
import { cloudinaryEnabled, uploadBuffer } from '../lib/cloudinary.js';
import { str, urlOrPath, bool, int, escapeRegex, isEmail, isId, slugify, cleanSeo, ValidationError, wrap } from '../lib/validate.js';

const router = Router();
const MAX_FAILS = 5;
const LOCK_MS = 15 * 60 * 1000;

const safeEqual = (a, b) => {
  const x = Buffer.from(String(a)); const y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
};
export function passwordProblem(pw) {
  if (typeof pw !== 'string' || pw.length < 10) return 'Password must be at least 10 characters.';
  if (pw.length > 128) return 'Password is too long.';
  if (!/[a-z]/i.test(pw) || !/\d/.test(pw)) return 'Password must contain letters and at least one number.';
  return null;
}
const sign = (u) => jwt.sign({ sub: String(u._id), role: u.role }, process.env.JWT_SECRET, { algorithm: 'HS256', expiresIn: process.env.JWT_EXPIRES_IN || '8h' });
const publicUser = (u) => ({ id: String(u._id), email: u.email, name: u.name, role: u.role });

/* ---------- Auth ---------- */
router.post('/login', loginLimiter, wrap(async (req, res) => {
  const email = str(req.body?.email, 160).toLowerCase();
  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  const fail = () => res.status(401).json({ error: 'Invalid email or password.' });
  if (!email || !password || password.length > 200) return fail();

  let user = await AdminUser.findOne({ email }).select('+passwordHash');

  // One-time safe bootstrap: only when NO admin exists yet and the env credentials match.
  if (!user && (await AdminUser.estimatedDocumentCount()) === 0
      && process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD
      && safeEqual(email, process.env.ADMIN_EMAIL.trim().toLowerCase()) && safeEqual(password, process.env.ADMIN_PASSWORD)) {
    user = await AdminUser.create({ email, name: 'Administrator', role: 'admin', passwordHash: await bcrypt.hash(password, 12) });
    user = await AdminUser.findById(user._id).select('+passwordHash');
  }
  if (!user || !user.active) { await bcrypt.compare(password, '$2a$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvali'); return fail(); }
  if (user.lockUntil && user.lockUntil > new Date()) return res.status(429).json({ error: 'Account temporarily locked. Try again later.' });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    user.failedLogins += 1;
    if (user.failedLogins >= MAX_FAILS) { user.lockUntil = new Date(Date.now() + LOCK_MS); user.failedLogins = 0; }
    await user.save();
    return fail();
  }
  user.failedLogins = 0; user.lockUntil = undefined; user.lastLoginAt = new Date();
  await user.save();
  res.json({ token: sign(user), admin: publicUser(user) });
}));

router.use(adminLimiter, auth);

router.get('/me', (req, res) => res.json({ admin: req.admin }));

router.post('/change-password', wrap(async (req, res) => {
  const { currentPassword = '', newPassword = '' } = req.body || {};
  const problem = passwordProblem(newPassword);
  if (problem) throw new ValidationError(problem);
  const user = await AdminUser.findById(req.admin.id).select('+passwordHash');
  if (!(await bcrypt.compare(String(currentPassword), user.passwordHash))) throw new ValidationError('Current password is incorrect.');
  user.passwordHash = await bcrypt.hash(newPassword, 12);
  await user.save();
  res.json({ ok: true });
}));

/* ---------- Users (admin only) ---------- */
router.get('/users', requireRole('admin'), wrap(async (_req, res) => res.json({ users: await AdminUser.find().sort({ createdAt: 1 }).lean().then((l) => l.map((u) => ({ id: String(u._id), email: u.email, name: u.name, role: u.role, active: u.active, lastLoginAt: u.lastLoginAt, createdAt: u.createdAt }))) })));

router.post('/users', requireRole('admin'), wrap(async (req, res) => {
  const email = str(req.body?.email, 160).toLowerCase();
  if (!isEmail(email)) throw new ValidationError('Enter a valid email address.');
  const problem = passwordProblem(req.body?.password);
  if (problem) throw new ValidationError(problem);
  const role = ['admin', 'editor'].includes(req.body?.role) ? req.body.role : 'editor';
  if (await AdminUser.exists({ email })) throw new ValidationError('A user with that email already exists.', 409);
  const user = await AdminUser.create({ email, name: str(req.body?.name, 80) || 'Editor', role, passwordHash: await bcrypt.hash(req.body.password, 12) });
  res.status(201).json({ user: publicUser(user) });
}));

router.patch('/users/:id', requireRole('admin'), wrap(async (req, res) => {
  if (!isId(req.params.id)) throw new ValidationError('Invalid id.');
  const user = await AdminUser.findById(req.params.id).select('+passwordHash');
  if (!user) return res.status(404).json({ error: 'User not found.' });
  const isSelf = String(user._id) === req.admin.id;
  if (req.body.name !== undefined) user.name = str(req.body.name, 80);
  if (req.body.role !== undefined) {
    if (!['admin', 'editor'].includes(req.body.role)) throw new ValidationError('Invalid role.');
    if (isSelf && req.body.role !== 'admin') throw new ValidationError('You cannot remove your own admin role.');
    user.role = req.body.role;
  }
  if (req.body.active !== undefined) {
    if (isSelf && !bool(req.body.active)) throw new ValidationError('You cannot deactivate your own account.');
    user.active = bool(req.body.active);
  }
  if (req.body.password) {
    const problem = passwordProblem(req.body.password);
    if (problem) throw new ValidationError(problem);
    user.passwordHash = await bcrypt.hash(req.body.password, 12);
  }
  await user.save();
  res.json({ user: publicUser(user) });
}));

router.delete('/users/:id', requireRole('admin'), wrap(async (req, res) => {
  if (!isId(req.params.id)) throw new ValidationError('Invalid id.');
  if (req.params.id === req.admin.id) throw new ValidationError('You cannot delete your own account.');
  const r = await AdminUser.findByIdAndDelete(req.params.id);
  if (!r) return res.status(404).json({ error: 'User not found.' });
  res.json({ ok: true });
}));

/* ---------- Enquiries ---------- */
router.get('/enquiries', requireRole('editor'), wrap(async (req, res) => {
  const filter = {};
  const q = str(req.query.q, 80);
  if (q) { const rx = new RegExp(escapeRegex(q), 'i'); filter.$or = [{ name: rx }, { phone: rx }, { email: rx }, { city: rx }, { message: rx }]; }
  if (ENQUIRY_STATUSES.includes(req.query.status)) filter.status = req.query.status;
  if (ENQUIRY_SOURCES.includes(req.query.source)) filter.source = req.query.source;
  const from = req.query.from ? new Date(req.query.from) : null; const to = req.query.to ? new Date(req.query.to) : null;
  if ((from && !Number.isNaN(from)) || (to && !Number.isNaN(to))) {
    filter.createdAt = {};
    if (from && !Number.isNaN(from)) filter.createdAt.$gte = from;
    if (to && !Number.isNaN(to)) { to.setHours(23, 59, 59, 999); filter.createdAt.$lte = to; }
  }
  const limit = int(req.query.limit, 20, 1, 100); const page = int(req.query.page, 1, 1, 100000);
  const [enquiries, total] = await Promise.all([
    Enquiry.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Enquiry.countDocuments(filter),
  ]);
  res.json({ enquiries, total, page, pages: Math.max(1, Math.ceil(total / limit)) });
}));

router.get('/enquiries/:id', requireRole('editor'), wrap(async (req, res) => {
  if (!isId(req.params.id)) throw new ValidationError('Invalid id.');
  const enquiry = await Enquiry.findById(req.params.id).lean();
  if (!enquiry) return res.status(404).json({ error: 'Enquiry not found.' });
  res.json({ enquiry });
}));

const updateStatus = wrap(async (req, res) => {
  if (!isId(req.params.id)) throw new ValidationError('Invalid id.');
  if (!ENQUIRY_STATUSES.includes(req.body?.status)) throw new ValidationError('Invalid status.');
  const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true }).lean();
  if (!enquiry) return res.status(404).json({ error: 'Enquiry not found.' });
  res.json({ enquiry });
});
router.patch('/enquiries/:id/status', requireRole('editor'), updateStatus); // backwards compatible
router.patch('/enquiries/:id', requireRole('editor'), updateStatus);

router.post('/enquiries/:id/notes', requireRole('editor'), wrap(async (req, res) => {
  if (!isId(req.params.id)) throw new ValidationError('Invalid id.');
  const text = str(req.body?.text, 1000);
  if (!text) throw new ValidationError('Note cannot be empty.');
  const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, { $push: { notes: { text, by: req.admin.email } } }, { new: true }).lean();
  if (!enquiry) return res.status(404).json({ error: 'Enquiry not found.' });
  res.status(201).json({ enquiry });
}));

router.delete('/enquiries/:id', requireRole('admin'), wrap(async (req, res) => {
  if (!isId(req.params.id)) throw new ValidationError('Invalid id.');
  const r = await Enquiry.findByIdAndDelete(req.params.id);
  if (!r) return res.status(404).json({ error: 'Enquiry not found.' });
  res.json({ ok: true });
}));

/* ---------- Dashboard ---------- */
router.get('/stats', requireRole('editor'), wrap(async (_req, res) => {
  const since7 = new Date(Date.now() - 7 * 864e5); const since30 = new Date(Date.now() - 30 * 864e5);
  const [total, byStatus, bySource, last7, last30, recentEnquiries, recentContent, byType, published, drafts, pages] = await Promise.all([
    Enquiry.countDocuments(),
    Enquiry.aggregate([{ $group: { _id: '$status', n: { $sum: 1 } } }]),
    Enquiry.aggregate([{ $group: { _id: '$source', n: { $sum: 1 } } }]),
    Enquiry.countDocuments({ createdAt: { $gte: since7 } }),
    Enquiry.countDocuments({ createdAt: { $gte: since30 } }),
    Enquiry.find().sort({ createdAt: -1 }).limit(6).select('name phone service source status createdAt').lean(),
    ContentItem.find().sort({ updatedAt: -1 }).limit(8).select('type title active updatedAt').lean(),
    ContentItem.aggregate([{ $group: { _id: '$type', n: { $sum: 1 } } }]),
    ContentItem.countDocuments({ active: true }),
    ContentItem.countDocuments({ active: false }),
    Page.countDocuments(),
  ]);
  const toMap = (rows) => Object.fromEntries(rows.map((r) => [r._id, r.n]));
  const status = toMap(byStatus); const source = toMap(bySource);
  res.json({
    total, last7, last30, byStatus: status, bySource: source, recentEnquiries, recentContent,
    contentByType: toMap(byType), published, drafts, pages,
    // legacy keys used by the previous admin UI
    newCount: status.new || 0, converted: status.converted || 0, calculatorCount: source['cost-calculator'] || 0, contactCount: source['contact-form'] || 0,
  });
}));

/* ---------- Pages ---------- */
function cleanSections(list) {
  if (!Array.isArray(list)) throw new ValidationError('Sections must be a list.');
  if (list.length > 40) throw new ValidationError('Too many sections.');
  return list.map((s, i) => {
    if (!SECTION_TYPES.includes(s?.type)) throw new ValidationError(`Section ${i + 1}: invalid type.`);
    const image = urlOrPath(s.image); const ctaUrl = urlOrPath(s.ctaUrl, 500);
    if (image === null) throw new ValidationError(`Section ${i + 1}: invalid image URL.`);
    if (ctaUrl === null) throw new ValidationError(`Section ${i + 1}: invalid button URL.`);
    return { id: str(s.id, 40) || crypto.randomUUID(), type: s.type, heading: str(s.heading, 200), subheading: str(s.subheading, 300), body: str(s.body, 8000), image, ctaLabel: str(s.ctaLabel, 60), ctaUrl, visible: bool(s.visible, true) };
  });
}
router.get('/pages', requireRole('editor'), wrap(async (_req, res) => res.json({ pages: await Page.find().sort({ key: 1 }).lean() })));
router.put('/pages/:key', requireRole('editor'), wrap(async (req, res) => {
  const key = slugify(req.params.key);
  if (!key) throw new ValidationError('Invalid page key.');
  const title = str(req.body?.title, 160);
  if (!title) throw new ValidationError('Page title is required.');
  const data = { key, title, status: req.body?.status === 'published' ? 'published' : 'draft', sections: cleanSections(req.body?.sections || []), updatedBy: req.admin.email };
  if (req.body?.seo) data.seo = cleanSeo(req.body.seo);
  const page = await Page.findOneAndUpdate({ key }, data, { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }).lean();
  res.json({ page });
}));
router.delete('/pages/:key', requireRole('admin'), wrap(async (req, res) => {
  const r = await Page.findOneAndDelete({ key: slugify(req.params.key) });
  if (!r) return res.status(404).json({ error: 'Page not found.' });
  res.json({ ok: true });
}));

/* ---------- Settings (admin only to change) ---------- */
const SETTING_TEXT = { siteName: 80, tagline: 120, phone: 30, whatsapp: 30, email: 120, workingHours: 120, footerText: 400, addressLine1: 120, addressLine2: 120, addressLine3: 120 };
const SETTING_URLS = ['logo', 'favicon', 'mapUrl', 'instagram', 'facebook', 'linkedin', 'youtube', 'pinterest', 'defaultOgImage'];
function cleanSettings(b = {}) {
  const out = {};
  for (const [k, max] of Object.entries(SETTING_TEXT)) if (b[k] !== undefined) out[k] = str(b[k], max);
  if (out.email && !isEmail(out.email)) throw new ValidationError('Contact email is not valid.');
  for (const k of SETTING_URLS) if (b[k] !== undefined) { const v = urlOrPath(b[k]); if (v === null) throw new ValidationError(`${k} must be a valid URL.`); out[k] = v; }
  if (b.defaultTitle !== undefined) out.defaultTitle = str(b.defaultTitle, 70);
  if (b.defaultDescription !== undefined) out.defaultDescription = str(b.defaultDescription, 200);
  return out;
}
router.get('/settings', requireRole('editor'), wrap(async (_req, res) => res.json({ settings: (await Setting.findOne({ key: 'site' }).lean())?.data || {} })));
router.put('/settings', requireRole('admin'), wrap(async (req, res) => {
  const data = cleanSettings(req.body);
  const current = (await Setting.findOne({ key: 'site' }).lean())?.data || {};
  const doc = await Setting.findOneAndUpdate({ key: 'site' }, { data: { ...current, ...data }, updatedBy: req.admin.email }, { new: true, upsert: true, setDefaultsOnInsert: true }).lean();
  res.json({ settings: doc.data });
}));

/* ---------- SEO ---------- */
router.get('/seo', requireRole('editor'), wrap(async (_req, res) => res.json({ entries: await Seo.find().sort({ path: 1 }).lean() })));
router.put('/seo', requireRole('editor'), wrap(async (req, res) => {
  const path = str(req.body?.path, 200);
  if (!path.startsWith('/')) throw new ValidationError('Path must start with "/".');
  const seo = cleanSeo(req.body);
  const entry = await Seo.findOneAndUpdate({ path }, { path, ...seo, noindex: bool(req.body?.noindex) }, { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }).lean();
  res.json({ entry });
}));
router.delete('/seo/:id', requireRole('editor'), wrap(async (req, res) => {
  if (!isId(req.params.id)) throw new ValidationError('Invalid id.');
  const r = await Seo.findByIdAndDelete(req.params.id);
  if (!r) return res.status(404).json({ error: 'Entry not found.' });
  res.json({ ok: true });
}));

/* ---------- Media upload (optional Cloudinary) ---------- */
const upload = multer({
  storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => (['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(file.mimetype) ? cb(null, true) : cb(new ValidationError('Only JPG, PNG, WebP or AVIF images up to 5 MB are allowed.'))),
});
router.get('/upload/status', requireRole('editor'), (_req, res) => res.json({ enabled: cloudinaryEnabled() }));
router.post('/upload', requireRole('editor'), (req, res, next) => {
  if (!cloudinaryEnabled()) return res.status(501).json({ error: 'Image uploads are not configured. Paste an image URL instead, or set the CLOUDINARY_* variables.' });
  upload.single('file')(req, res, (err) => {
    if (err?.code === 'LIMIT_FILE_SIZE') return next(new ValidationError('Image is larger than 5 MB.'));
    return err ? next(err) : next();
  });
}, wrap(async (req, res) => {
  if (!req.file) throw new ValidationError('No file received.');
  res.status(201).json(await uploadBuffer(req.file.buffer));
}));

export default router;

