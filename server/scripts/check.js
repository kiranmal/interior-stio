// Read-only connectivity check:  npm run check
import '../lib/env.js';
import mongoose from 'mongoose';
import { connectDb } from '../lib/db.js';
import AdminUser from '../models/AdminUser.js';
import ContentItem from '../models/ContentItem.js';
import Enquiry from '../models/Enquiry.js';

if (!process.env.MONGO_URI) { console.error('MONGO_URI is not set.'); process.exit(1); }
try {
  await connectDb();
  console.log('MongoDB connection OK, database:', mongoose.connection.name);
  console.log('Admin users:', await AdminUser.countDocuments(), '| Content items:', await ContentItem.countDocuments(), '| Enquiries:', await Enquiry.countDocuments());
} catch (e) { console.error('Connection failed:', e.message); process.exitCode = 1; }
await mongoose.disconnect().catch(() => {});
