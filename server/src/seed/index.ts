import { connectDatabase, disconnectDatabase } from '../config/database.config';
import { validateEnv } from '../config/env.config';
import { logger } from '../shared/utils/logger';
import { seedFulfillmentData } from './fulfillment.seed';

async function seed(): Promise<void> {
  validateEnv();
  await connectDatabase();

  logger.info('Seed', 'Starting database seed...');

  await seedFulfillmentData();

  logger.info('Seed', 'Seed complete!');

  await disconnectDatabase();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
