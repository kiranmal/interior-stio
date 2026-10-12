import mongoose from 'mongoose';

export const SECTION_TYPES = ['hero', 'intro', 'text', 'banner', 'cta', 'services', 'projects', 'gallery', 'testimonials', 'blog', 'faq', 'process', 'team'];

const section = new mongoose.Schema({
  id: { type: String, required: true },
  type: { type: String, enum: SECTION_TYPES, required: true },
  heading: { type: String, maxlength: 200 },
  subheading: { type: String, maxlength: 300 },
  body: { type: String, maxlength: 8000 },
  image: { type: String, maxlength: 1000 },
  ctaLabel: { type: String, maxlength: 60 },
  ctaUrl: { type: String, maxlength: 500 },
  visible: { type: Boolean, default: true },
}, { _id: false });

const schema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 100 },
  title: { type: String, required: true, trim: true, maxlength: 160 },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  sections: { type: [section], default: [] }, // array order == display order
  seo: { type: new mongoose.Schema({ title: String, description: String, canonical: String, ogImage: String }, { _id: false }), default: undefined },
  updatedBy: String,
}, { timestamps: true });
schema.set('toJSON', { transform: (_d, r) => { delete r.__v; return r; } });
export default mongoose.models.Page || mongoose.model('Page', schema);
