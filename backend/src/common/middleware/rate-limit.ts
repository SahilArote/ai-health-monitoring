import { Request, Response, NextFunction } from 'express';
import { redis } from '../../config/redis';
import { config } from '../../config/index';
import { sendError } from '../utils/response';

export const vitalsRateLimiter = async (req: Request, res: Response, next: NextFunction) => {
  const patientId = req.user?.patientId || req.ip || 'anonymous';
  const key = `ratelimit:vitals:${patientId}`;
  const windowMs = config.rateLimit.windowMs;
  const maxRequests = config.rateLimit.maxRequests;

  try {
    if (redis.status === 'ready' || redis.status === 'connecting') {
      const requests = await redis.incr(key);
      if (requests === 1) {
        await redis.pexpire(key, windowMs);
      }
      if (requests > maxRequests) {
        return sendError(res, 'Rate limit exceeded for vitals ingestion (max 60 req/min)', 429);
      }
    }
  } catch (err) {
    console.warn('Rate limiter Redis error, bypassing rate limit:', err);
  }

  next();
};
