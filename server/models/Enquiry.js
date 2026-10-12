import mongoose from 'mongoose';

export const ENQUIRY_STATUSES = ['new', 'contacted', 'discussion', 'site-visit', 'converted', 'closed'];
export const ENQUIRY_SOURCES = ['contact-form', 'cost-calculator', 'quote'];

const schema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  phone: { type: String, required: true, trim: true },
  email: { type: String, trim: true, lowercase: true, maxlength: 120 },
  city: { type: String, trim: true, maxlength: 120 },
  service: { type: String, trim: true, maxlength: 120 },
  message: { type: String, trim: true, maxlength: 2000 },
  source: { type: String, enum: ENQUIRY_SOURCES, required: true },
  propertyType: { type: String, trim: true, maxlength: 50 },
  area: { type: Number, min: 0 },
  quality: { type: String, trim: true, maxlength: 50 },
  budget: { type: String, trim: true, maxlength: 60 },
  estimatedLower: { type: Number, min: 0 },
  estimatedUpper: { type: Number, min: 0 },
  status: { type: String, enum: ENQUIRY_STATUSES, default: 'new' },
  notes: [{ text: { type: String, maxlength: 1000 }, by: String, at: { type: Date, default: Date.now } }],
}, { timestamps: true });

schema.index({ createdAt: -1 });
schema.index({ phone: 1, createdAt: -1 });
schema.index({ status: 1, createdAt: -1 });
schema.index({ source: 1 });
schema.set('toJSON', { transform: (_d, r) => { delete r.__v; return r; } });
export default mongoose.models.Enquiry || mongoose.model('Enquiry', schema);
