import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  path: { type: String, required: true, unique: true, trim: true, maxlength: 200 },
  title: { type: String, trim: true, maxlength: 70 },
  description: { type: String, trim: true, maxlength: 200 },
  canonical: { type: String, trim: true, maxlength: 500 },
  ogImage: { type: String, trim: true, maxlength: 1000 },
  noindex: { type: Boolean, default: false },
}, { timestamps: true });
schema.set('toJSON', { transform: (_d, r) => { delete r.__v; return r; } });
export default mongoose.models.Seo || mongoose.model('Seo', schema);
