import dotenv from 'dotenv';
import path from 'path';

// Load .env from multiple candidate locations for monorepo development
dotenv.config(); // default cwd
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const DEV_JWT_SECRET = 'dealflow360_super_secret_jwt_key_2026';
const DEFAULT_MONGO_URI = 'mongodb+srv://mrmohans143_db_user:L2RXOOUv3vZtaCDE@oddo.72qcces.mongodb.net/dealflow360?retryWrites=true&w=majority';

export function validateEnv(): void {
  if (!process.env.JWT_SECRET) {
    process.env.JWT_SECRET = DEV_JWT_SECRET;
  }
  if (!process.env.MONGODB_URI) {
    process.env.MONGODB_URI = DEFAULT_MONGO_URI;
  }
  if (!process.env.PORT) {
    process.env.PORT = '5000';
  }
}

// Ensure defaults are populated immediately on module evaluation
validateEnv();

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',

  MONGODB_URI: process.env.MONGODB_URI || DEFAULT_MONGO_URI,

  JWT_SECRET: process.env.JWT_SECRET || DEV_JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'dealflow360_refresh_secret',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '30d',

  isDevelopment: (process.env.NODE_ENV || 'development') === 'development',
  isProduction: process.env.NODE_ENV === 'production',
} as const;

