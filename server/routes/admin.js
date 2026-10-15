import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import multer from 'multer';
import * as AdminUsers from '../models/adminUsers.js';
import { publicUser } from '../models/adminUsers.js';
import * as Enquiries from '../models/enquiries.js';
import { ENQUIRY_STATUSES, ENQUIRY_SOURCES } from '../models/enquiries.js';
import * as Content from '../models/content.js';
import * as Pages from '../models/pages.js';
import { SECTION_TYPES } from '../models/pages.js';
import * as Settings from '../models/settings.js';
import { SOCIAL_PLATFORMS } from '../models/settings.js';
import * as Seo from '../models/Seo.js';
import auth, { requireRole } from '../middleware/auth.js';
import { loginLimiter, adminLimiter } from '../middleware/rateLimit.js';
import { cloudinaryEnabled, uploadBuffer } from '../lib/cloudinary.js';
import { str, urlOrPath, bool, int, isEmail, isId, slugify, cleanSeo, ValidationError, wrap } from '../lib/validate.js';

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
const sign = (u) => jwt.sign({ sub: String(u.id), role: u.role }, process.env.JWT_SECRET, { algorithm: 'HS256', expiresIn: process.env.JWT_EXPIRES_IN || '8h' });

/* ---------- Auth ---------- */
router.post('/login', loginLimiter, wrap(async (req, res) => {
  const email = str(req.body?.email, 160).toLowerCase();
  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  const fail = () => res.status(401).json({ error: 'Invalid email or password.' });
  if (!email || !password || password.length > 200) return fail();

  let user = await AdminUsers.findByEmail(email);

  // One-time safe bootstrap: only when NO admin exists yet and the env credentials match.
  if (!user && (await AdminUsers.count()) === 0
      && process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD
      && safeEqual(email, process.env.ADMIN_EMAIL.trim().toLowerCase()) && safeEqual(password, process.env.ADMIN_PASSWORD)) {
    user = await AdminUsers.create({ email, name: 'Administrator', role: 'admin', passwordHash: await bcrypt.hash(password, 12) });
  }
  if (!user || !user.active) { await bcrypt.compare(password, '$2a$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvali'); return fail(); }
  if (user.lockUntil && new Date(user.lockUntil) > new Date()) return res.status(429).json({ error: 'Account temporarily locked. Try again later.' });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    const fails = user.failedLogins + 1;
    await AdminUsers.update(user.id, fails >= MAX_FAILS ? { failedLogins: 0, lockUntil: new Date(Date.now() + LOCK_MS) } : { failedLogins: fails });
    return fail();
  }
  await AdminUsers.update(user.id, { failedLogins: 0, lockUntil: null, lastLoginAt: new Date() });
  res.json({ token: sign(user), admin: publicUser(user) });
}));

router.use(adminLimiter, auth);

router.get('/me', (req, res) => res.json({ admin: req.admin }));

router.post('/change-password', wrap(async (req, res) => {
  const { currentPassword = '', newPassword = '' } = req.body || {};
  const problem = passwordProblem(newPassword);
  if (problem) throw new ValidationError(problem);
  const user = await AdminUsers.findById(req.admin.id);
  if (!(await bcrypt.compare(String(currentPassword), user.passwordHash))) throw new ValidationError('Current password is incorrect.');
  await AdminUsers.update(user.id, { passwordHash: await bcrypt.hash(newPassword, 12) });
  res.json({ ok: true });
}));

/* ---------- Users (admin only) ---------- */
router.get('/users', requireRole('admin'), wrap(async (_req, res) => {
  res.json({ users: (await AdminUsers.list()).map((u) => ({ id: u.id, email: u.email, name: u.name, role: u.role, active: u.active, lastLoginAt: u.lastLoginAt, createdAt: u.createdAt })) });
}));

router.post('/users', requireRole('admin'), wrap(async (req, res) => {
  const email = str(req.body?.email, 160).toLowerCase();
  if (!isEmail(email)) throw new ValidationError('Enter a valid email address.');
  const problem = passwordProblem(req.body?.password);
  if (problem) throw new ValidationError(problem);
  const role = ['admin', 'editor'].includes(req.body?.role) ? req.body.role : 'editor';
  if (await AdminUsers.findByEmail(email)) throw new ValidationError('A user with that email already exists.', 409);
  const user = await AdminUsers.create({ email, name: str(req.body?.name, 80) || 'Editor', role, passwordHash: await bcrypt.hash(req.body.password, 12) });
  res.status(201).json({ user: publicUser(user) });
}));

router.patch('/users/:id', requireRole('admin'), wrap(async (req, res) => {
  if (!isId(req.params.id)) throw new ValidationError('Invalid id.');
  const user = await AdminUsers.findById(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found.' });
  const isSelf = user.id === req.admin.id;
  const patch = {};
  if (req.body.name !== undefined) patch.name = str(req.body.name, 80);
  if (req.body.role !== undefined) {
    if (!['admin', 'editor'].includes(req.body.role)) throw new ValidationError('Invalid role.');
    if (isSelf && req.body.role !== 'admin') throw new ValidationError('You cannot remove your own admin role.');
    patch.role = req.body.role;
  }
  if (req.body.active !== undefined) {
    if (isSelf && !bool(req.body.active)) throw new ValidationError('You cannot deactivate your own account.');
    patch.active = bool(req.body.active);
  }
  if (req.body.password) {
    const problem = passwordProblem(req.body.password);
    if (problem) throw new ValidationError(problem);
    patch.passwordHash = await bcrypt.hash(req.body.password, 12);
  }
  res.json({ user: publicUser(await AdminUsers.update(user.id, patch)) });
}));

router.delete('/users/:id', requireRole('admin'), wrap(async (req, res) => {
  if (!isId(req.params.id)) throw new ValidationError('Invalid id.');
  if (req.params.id === req.admin.id) throw new ValidationError('You cannot delete your own account.');
  if (!(await AdminUsers.remove(req.params.id))) return res.status(404).json({ error: 'User not found.' });
  res.json({ ok: true });
}));

/* ---------- Enquiries ---------- */
router.get('/enquiries', requireRole('editor'), wrap(async (req, res) => {
  const limit = int(req.query.limit, 20, 1, 100); const page = int(req.query.page, 1, 1, 100000);
  const from = req.query.from ? new Date(req.query.from) : null; const to = req.query.to ? new Date(req.query.to) : null;
  if (to && !Number.isNaN(to.getTime())) to.setHours(23, 59, 59, 999);
  const { enquiries, total } = await Enquiries.list({
    q: str(req.query.q, 80), limit, page,
    status: ENQUIRY_STATUSES.includes(req.query.status) ? req.query.status : undefined,
    source: ENQUIRY_SOURCES.includes(req.query.source) ? req.query.source : undefined,
    from: from && !Number.isNaN(from.getTime()) ? from : undefined, to: to && !Number.isNaN(to.getTime()) ? to : undefined,
  });
  res.json({ enquiries, total, page, pages: Math.max(1, Math.ceil(total / limit)) });
}));

router.get('/enquiries/:id', requireRole('editor'), wrap(async (req, res) => {
  if (!isId(req.params.id)) throw new ValidationError('Invalid id.');
  const enquiry = await Enquiries.get(req.params.id);
  if (!enquiry) return res.status(404).json({ error: 'Enquiry not found.' });
  res.json({ enquiry });
}));

const updateStatus = wrap(async (req, res) => {
  if (!isId(req.params.id)) throw new ValidationError('Invalid id.');
  if (!ENQUIRY_STATUSES.includes(req.body?.status)) throw new ValidationError('Invalid status.');
  const enquiry = await Enquiries.setStatus(req.params.id, req.body.status);
  if (!enquiry) return res.status(404).json({ error: 'Enquiry not found.' });
  res.json({ enquiry });
});
router.patch('/enquiries/:id/status', requireRole('editor'), updateStatus); // backwards compatible
router.patch('/enquiries/:id', requireRole('editor'), updateStatus);

router.post('/enquiries/:id/notes', requireRole('editor'), wrap(async (req, res) => {
  if (!isId(req.params.id)) throw new ValidationError('Invalid id.');
  const text = str(req.body?.text, 1000);
  if (!text) throw new ValidationError('Note cannot be empty.');
  const enquiry = await Enquiries.addNote(req.params.id, text, req.admin.email);
  if (!enquiry) return res.status(404).json({ error: 'Enquiry not found.' });
  res.status(201).json({ enquiry });
}));

router.delete('/enquiries/:id', requireRole('admin'), wrap(async (req, res) => {
  if (!isId(req.params.id)) throw new ValidationError('Invalid id.');
  if (!(await Enquiries.remove(req.params.id))) return res.status(404).json({ error: 'Enquiry not found.' });
  res.json({ ok: true });
}));

/* ---------- Dashboard ---------- */
router.get('/stats', requireRole('editor'), wrap(async (_req, res) => {
  const [enq, content, pages] = await Promise.all([Enquiries.stats(), Content.stats(), Pages.count()]);
  res.json({
    ...enq, ...content, pages,
    // legacy keys used by the previous admin UI
    newCount: enq.byStatus.new || 0, converted: enq.byStatus.converted || 0, calculatorCount: enq.bySource['cost-calculator'] || 0, contactCount: enq.bySource['contact-form'] || 0,
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
router.get('/pages', requireRole('editor'), wrap(async (_req, res) => res.json({ pages: await Pages.listAll() })));
router.put('/pages/:key', requireRole('editor'), wrap(async (req, res) => {
  const key = slugify(req.params.key);
  if (!key) throw new ValidationError('Invalid page key.');
  const title = str(req.body?.title, 160);
  if (!title) throw new ValidationError('Page title is required.');
  const page = await Pages.upsert({
    key, title, status: req.body?.status === 'published' ? 'published' : 'draft', sections: cleanSections(req.body?.sections || []),
    seo: req.body?.seo ? cleanSeo(req.body.seo) : undefined, updatedBy: req.admin.email,
  });
  res.json({ page });
}));
router.delete('/pages/:key', requireRole('admin'), wrap(async (req, res) => {
  if (!(await Pages.remove(slugify(req.params.key)))) return res.status(404).json({ error: 'Page not found.' });
  res.json({ ok: true });
}));

/* ---------- Settings (admin only to change) ---------- */
const SETTING_TEXT = { siteName: 80, tagline: 120, phone: 30, whatsapp: 30, email: 120, workingHours: 120, footerText: 400, addressLine1: 120, addressLine2: 120, addressLine3: 120 };
const SETTING_URLS = ['logo', 'favicon', 'mapUrl', ...SOCIAL_PLATFORMS, 'defaultOgImage'];
function cleanSettings(b = {}) {
  const out = {};
  for (const [k, max] of Object.entries(SETTING_TEXT)) if (b[k] !== undefined) out[k] = str(b[k], max);
  if (out.email && !isEmail(out.email)) throw new ValidationError('Contact email is not valid.');
  for (const k of SETTING_URLS) if (b[k] !== undefined) { const v = urlOrPath(b[k]); if (v === null) throw new ValidationError(`${k} must be a valid URL.`); out[k] = v; }
  if (b.defaultTitle !== undefined) out.defaultTitle = str(b.defaultTitle, 70);
  if (b.defaultDescription !== undefined) out.defaultDescription = str(b.defaultDescription, 200);
  return out;
}
router.get('/settings', requireRole('editor'), wrap(async (_req, res) => res.json({ settings: await Settings.getAll() })));
router.put('/settings', requireRole('admin'), wrap(async (req, res) => res.json({ settings: await Settings.save(cleanSettings(req.body), req.admin.email) })));

/* ---------- SEO ---------- */
router.get('/seo', requireRole('editor'), wrap(async (_req, res) => res.json({ entries: await Seo.listAll() })));
router.put('/seo', requireRole('editor'), wrap(async (req, res) => {
  const path = str(req.body?.path, 200);
  if (!path.startsWith('/')) throw new ValidationError('Path must start with "/".');
  const seo = cleanSeo(req.body);
  res.json({ entry: await Seo.upsert({ path, ...seo, noindex: bool(req.body?.noindex) }) });
}));
router.delete('/seo/:id', requireRole('editor'), wrap(async (req, res) => {
  if (!isId(req.params.id)) throw new ValidationError('Invalid id.');
  if (!(await Seo.remove(req.params.id))) return res.status(404).json({ error: 'Entry not found.' });
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


