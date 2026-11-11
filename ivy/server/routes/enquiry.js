import { Router } from 'express';
import * as Enquiries from '../models/enquiries.js';
import { ENQUIRY_SOURCES } from '../models/enquiries.js';
import { enquiryLimiter } from '../middleware/rateLimit.js';
import { str, isEmail, wrap } from '../lib/validate.js';

const router = Router();
const cleanPhone = (v = '') => String(v).replace(/\D/g, '').replace(/^(91|0)(?=\d{10}$)/, '');
const num = (v) => (Number.isFinite(Number(v)) && Number(v) >= 0 && v !== '' && v !== null ? Number(v) : undefined);

router.post('/', enquiryLimiter, wrap(async (req, res) => {
  const b = req.body || {};
  // Honeypot: real users never fill this hidden field. Pretend success so bots learn nothing.
  if (str(b.website, 200)) return res.status(201).json({ ok: true, message: 'Enquiry received successfully.' });

  const source = b.source || 'contact-form';
  if (!ENQUIRY_SOURCES.includes(source)) return res.status(400).json({ error: 'Invalid enquiry source.' });
  const name = str(b.name, 80);
  if (name.length < 2) return res.status(400).json({ error: 'Please enter your name.' });
  const phone = cleanPhone(b.phone);
  if (!/^[6-9]\d{9}$/.test(phone)) return res.status(400).json({ error: 'Please enter a valid 10-digit Indian mobile number.' });
  const email = str(b.email, 120).toLowerCase();
  if (email && !isEmail(email)) return res.status(400).json({ error: 'Please enter a valid email address.' });
  const message = str(b.message, 2000);
  if (source !== 'cost-calculator' && message.length < 5) return res.status(400).json({ error: 'Please tell us a little about your requirement.' });

  // Duplicate protection: same phone + source + message within 10 minutes
  const dup = await Enquiries.isDuplicate({ phone, source, message });
  if (dup) return res.status(200).json({ ok: true, duplicate: true, message: 'We already have your enquiry and will contact you shortly.' });

  const id = await Enquiries.create({
    name, phone, email, source, message,
    city: str(b.city, 120), service: str(b.service, 120), propertyType: str(b.propertyType, 50),
    quality: str(b.quality, 50), budget: str(b.budget, 60),
    area: num(b.area), estimatedLower: num(b.estimatedLower), estimatedUpper: num(b.estimatedUpper),
  });
  res.status(201).json({ ok: true, id, message: 'Enquiry received successfully.' });
}));

export default router;
