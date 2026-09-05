import { connectDatabase, disconnectDatabase } from '../config/database.config';
import { validateEnv } from '../config/env.config';
import { logger } from '../shared/utils/logger';
import { UserModel, hashPassword } from '../modules/auth/models/user.model';
import { UserRole } from '../shared';

export async function seedDemoUsers(): Promise<void> {
  const defaultPasswordHash = await hashPassword('Password123!');

  const demoUsers = [
    {
      name: 'System Admin',
      email: 'admin@dealflow360.com',
      passwordHash: defaultPasswordHash,
      role: UserRole.ADMIN,
      isActive: true,
    },
    {
      name: 'Sales Manager',
      email: 'manager@dealflow360.com',
      passwordHash: defaultPasswordHash,
      role: UserRole.SALES_MANAGER,
      isActive: true,
    },
    {
      name: 'Sales Representative',
      email: 'sales@dealflow360.com',
      passwordHash: defaultPasswordHash,
      role: UserRole.SALES_REP,
      isActive: true,
    },
    {
      name: 'Finance Officer',
      email: 'finance@dealflow360.com',
      passwordHash: defaultPasswordHash,
      role: UserRole.FINANCE,
      isActive: true,
    },
  ];

  for (const user of demoUsers) {
    const exists = await UserModel.findOne({ email: user.email });
    if (!exists) {
      await UserModel.create(user);
      logger.info('Seed', `Created demo user: ${user.email} (${user.role})`);
    } else {
      logger.info('Seed', `Demo user already exists: ${user.email}`);
    }
  }
}

async function seed(): Promise<void> {
  validateEnv();
  await connectDatabase();

  logger.info('Seed', 'Starting database seed...');
  await seedDemoUsers();
  logger.info('Seed', 'Seed complete!');

  await disconnectDatabase();
}

if (require.main === module) {
  seed().catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  });
}
