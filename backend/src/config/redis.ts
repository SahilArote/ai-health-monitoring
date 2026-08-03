import Redis from 'ioredis';
import { config } from './index';

export const redis = new Redis(config.redisUrl || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
  enableReadyCheck: true,
  lazyConnect: true,
});

redis.on('error', (err) => {
  console.error('Redis connection error:', err);
});

redis.on('connect', () => {
  console.log('Redis connected');
});