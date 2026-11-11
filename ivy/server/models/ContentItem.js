import mongoose from 'mongoose';

export const CONTENT_TYPES = ['service', 'project', 'gallery', 'testimonial', 'blog', 'team', 'faq', 'banner'];
export const SLUG_TYPES = ['service', 'project', 'blog'];

// Same collection ("contentitems") as the original app, so existing documents keep working.
const schema = new mongoose.Schema({
  type: { type: String, enum: CONTENT_TYPES, required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 160 },
  slug: { type: String, trim: true, lowercase: true, maxlength: 120 },
  description: { type: String, trim: true, maxlength: 2000 },
  content: { type: String, maxlength: 60000 },
  image: { type: String, trim: true, maxlength: 1000 },
  gallery: { type: [String], default: undefined },
  category: { type: String, trim: true, maxlength: 100 },
  location: { type: String, trim: true, maxlength: 120 },
  tags: { type: [String], default: undefined },
  author: { type: String, trim: true, maxlength: 100 },
  meta: { type: mongoose.Schema.Types.Mixed, default: {} },
  seo: { type: new mongoose.Schema({ title: String, description: String, canonical: String, ogImage: String }, { _id: false }), default: undefined },
  order: { type: Number, default: 0 },
  active: { type: Boolean, default: true }, // "published"
  featured: { type: Boolean, default: false },
  publishedAt: { type: Date },
}, { timestamps: true });

schema.index({ type: 1, order: 1, createdAt: -1 });
schema.index({ type: 1, slug: 1 }, { unique: true, partialFilterExpression: { slug: { $type: 'string' } } });
schema.set('toJSON', { transform: (_d, r) => { delete r.__v; return r; } });
export default mongoose.models.ContentItem || mongoose.model('ContentItem', schema);
