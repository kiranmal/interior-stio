import mongoose from 'mongoose';

mongoose.set('strictQuery', true);
let connecting = null;

export const dbReady = () => mongoose.connection.readyState === 1;

export function connectDb() {
  if (dbReady()) return Promise.resolve(mongoose.connection);
  if (connecting) return connecting;
  const options = {
    maxPoolSize: Number(process.env.MONGO_MAX_POOL_SIZE) || 10,
    serverSelectionTimeoutMS: 8000,
    ...(process.env.MONGO_DB_NAME ? { dbName: process.env.MONGO_DB_NAME } : {}),
  };
  connecting = mongoose.connect(process.env.MONGO_URI, options)
    .then((m) => m.connection)
    .finally(() => { connecting = null; });
  return connecting;
}

/** Keep trying in the background so the API can start and report health while Mongo is unreachable. */
export function connectWithRetry(log = console, onConnected) {
  const attempt = async () => {
    try {
      await connectDb(); log.log('MongoDB connected');
      if (onConnected) { try { await onConnected(); } catch (e) { log.error('Post-connect task failed:', e.message); } }
      return;
    }
    catch (e) { log.error('MongoDB connection failed (retrying in 5s):', e.message); setTimeout(attempt, 5000); }
  };
  return attempt();
}
