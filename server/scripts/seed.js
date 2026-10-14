// Safe, repeatable seed (additive only).   Usage: npm run seed
import '../lib/env.js';
import mongoose from 'mongoose';
import { connectDb } from '../lib/db.js';
import { seedMissing } from './seedLib.js';

if (!process.env.MONGO_URI) { console.error('MONGO_URI is not set.'); process.exit(1); }
await connectDb();
console.log(`Done. ${await seedMissing()} record(s) added.`);
await mongoose.disconnect();
