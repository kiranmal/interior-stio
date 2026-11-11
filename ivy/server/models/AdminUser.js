import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 160 },
  name: { type: String, trim: true, maxlength: 80, default: 'Administrator' },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ['admin', 'editor'], default: 'editor' },
  active: { type: Boolean, default: true },
  failedLogins: { type: Number, default: 0 },
  lockUntil: { type: Date },
  lastLoginAt: { type: Date },
}, { timestamps: true });

schema.set('toJSON', { transform: (_d, r) => { delete r.passwordHash; delete r.__v; delete r.failedLogins; delete r.lockUntil; return r; } });
export default mongoose.models.AdminUser || mongoose.model('AdminUser', schema);
