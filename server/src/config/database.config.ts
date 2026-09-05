import mongoose from 'mongoose';
import { env } from './env.config';

let isConnected = false;

export async function connectDatabase(): Promise<void> {
  if (isConnected) {
    console.log('[DB] Already connected to MongoDB');
    return;
  }

  try {
    const connection = await mongoose.connect(env.MONGODB_URI, {
      dbName: 'dealflow360',
      serverSelectionTimeoutMS: 2500,
    });

    isConnected = true;
    console.log(`[DB] Connected to MongoDB: ${connection.connection.host}`);

    mongoose.connection.on('error', (err) => {
      console.error('[DB] MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('[DB] MongoDB disconnected');
      isConnected = false;
    });
  } catch (error: any) {
    if (env.isDevelopment && (error?.message?.includes('ECONNREFUSED') || !env.MONGODB_URI)) {
      console.warn('[DB] Local MongoDB not reachable. Initializing embedded MongoMemoryServer fallback...');
      try {
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        const mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        const connection = await mongoose.connect(uri, { dbName: 'dealflow360' });
        isConnected = true;
        console.log(`[DB] Connected to embedded in-memory MongoDB: ${connection.connection.host}`);
        return;
      } catch (memErr) {
        console.error('[DB] Embedded MongoMemoryServer failed:', memErr);
      }
    }
    console.warn('[DB] Could not connect to MongoDB instance. Server running with fallback:', error);
  }
}

export async function disconnectDatabase(): Promise<void> {
  if (!isConnected) return;
  await mongoose.disconnect();
  isConnected = false;
  console.log('[DB] Disconnected from MongoDB');
}
