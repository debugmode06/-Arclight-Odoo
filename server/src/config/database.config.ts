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
  } catch (error) {
    console.warn('[DB] Could not connect to MongoDB instance. Server will run with in-memory fallback for local development:', error);
  }
}

export async function disconnectDatabase(): Promise<void> {
  if (!isConnected) return;
  await mongoose.disconnect();
  isConnected = false;
  console.log('[DB] Disconnected from MongoDB');
}
