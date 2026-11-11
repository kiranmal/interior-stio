import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, default: 'site' },
  data: { type: mongoose.Schema.Types.Mixed, default: {} },
  updatedBy: String,
}, { timestamps: true });
export default mongoose.models.Setting || mongoose.model('Setting', schema);
