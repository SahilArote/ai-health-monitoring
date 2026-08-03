import app from './app';
import { config } from './config';
import { prisma } from './config/prisma';

const server = app.listen(config.port, () => {
  console.log(`🚀 AI Health Monitoring Backend running on port ${config.port} [${config.nodeEnv}]`);
  console.log(`🏥 API Healthcheck available at http://localhost:${config.port}/health`);
});

// Graceful Shutdown
const shutdown = async (signal: string) => {
  console.log(`Received ${signal}. Shutting down gracefully...`);
  server.close(async () => {
    await prisma.$disconnect();
    console.log('Database connections closed. Process exited.');
    process.exit(0);
  });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
