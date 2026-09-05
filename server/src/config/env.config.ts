import dotenv from 'dotenv';
import path from 'path';

// Load .env from server directory or root directory
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'PORT',
];

export function validateEnv(): void {
  const missing = requiredEnvVars.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    if (process.env.NODE_ENV === 'production') {
      console.error(`[Config] Missing required environment variables: ${missing.join(', ')}`);
      console.error('[Config] Copy .env.example to .env and fill in the values.');
      process.exit(1);
    } else {
      console.warn(`[Config] Missing env variables in development (${missing.join(', ')}). Using fallback defaults.`);
    }
  }
}

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',

  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/dealflow360',

  JWT_SECRET: process.env.JWT_SECRET || 'dealflow360_jwt_secret_key_dev_2026',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'dealflow360_refresh_secret_key_dev_2026',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '30d',

  isDevelopment: process.env.NODE_ENV === 'development' || !process.env.NODE_ENV,
  isProduction: process.env.NODE_ENV === 'production',
} as const;
