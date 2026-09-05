/**
 * Database Seed Script
 * Owner: Member 1
 *
 * Run with: npm run seed (from server/)
 *
 * This script will create demo data for development and hackathon demonstration.
 * Seed data should be idempotent — safe to run multiple times.
 *
 * TODO: Member 1 — Implement seed after models are created:
 * 1. Connect to DB
 * 2. Clear existing seed data (by a flag or collection)
 * 3. Create demo users (all roles)
 * 4. Create demo customers
 * 5. Create demo products + categories
 * 6. Create demo price lists
 * 7. Call member-specific seeds for quotations, invoices etc.
 */

import { connectDatabase, disconnectDatabase } from '../config/database.config';
import { validateEnv } from '../config/env.config';
import { logger } from '../shared/utils/logger';

async function seed(): Promise<void> {
  validateEnv();
  await connectDatabase();

  logger.info('Seed', 'Starting database seed...');

  // TODO: Add seed operations here
  logger.info('Seed', 'Seed complete (no operations defined yet)');

  await disconnectDatabase();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
