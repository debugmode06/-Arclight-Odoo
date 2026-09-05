import { validateEnv, env, connectDatabase } from './config';
import { app } from './app';
import { logger } from './shared/utils/logger';

async function bootstrap(): Promise<void> {
  // 1. Validate all required environment variables
  validateEnv();

  // 2. Connect to MongoDB
  await connectDatabase();

  // 2.5 Auto-seed demo accounts in development
  if (env.isDevelopment) {
    const { seedDemoUsers } = await import('./seed');
    await seedDemoUsers().catch((err: unknown) => logger.error('Seed', 'Auto-seed error', err));
  }

  // 3. Start the Express server
  const server = app.listen(env.PORT, () => {
    logger.info('Server', `DealFlow360 API running on port ${env.PORT}`);
    logger.info('Server', `Environment: ${env.NODE_ENV}`);
    logger.info('Server', `Health check: http://localhost:${env.PORT}/health`);
    logger.info('Server', `API base: http://localhost:${env.PORT}/api`);
  });

  // 4. Graceful shutdown handlers
  const shutdown = async (signal: string): Promise<void> => {
    logger.info('Server', `Received ${signal}. Shutting down gracefully...`);
    server.close(async () => {
      logger.info('Server', 'HTTP server closed');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  process.on('unhandledRejection', (reason) => {
    logger.error('Server', 'Unhandled promise rejection', reason);
    process.exit(1);
  });

  process.on('uncaughtException', (err) => {
    logger.error('Server', 'Uncaught exception', err);
    process.exit(1);
  });
}

bootstrap();
