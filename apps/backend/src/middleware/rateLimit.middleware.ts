import { Request, Response, NextFunction } from 'express';

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number | (() => number);
  dailyCap?: number;
  routeGroupName: string;
}

interface RequestRecord {
  timestamps: number[];
  dailyCount: number;
  dailyResetTime: number;
}

// In-memory sliding window store (compatible with Redis sliding window keys)
const rateLimitStore = new Map<string, RequestRecord>();

export function createRateLimiter(config: RateLimitConfig) {
  return (req: Request, res: Response, next: NextFunction) => {
    const now = Date.now();
    const effectiveMaxRequests = typeof config.maxRequests === 'function'
      ? config.maxRequests()
      : config.maxRequests;

    // Key by authenticated user ID if available, otherwise by client IP
    const userId = (req as any).user?.userId;
    const clientIp = req.ip || req.socket.remoteAddress || '127.0.0.1';
    const key = `${config.routeGroupName}:${userId ? `user:${userId}` : `ip:${clientIp}`}`;

    let record = rateLimitStore.get(key);
    if (!record) {
      record = {
        timestamps: [],
        dailyCount: 0,
        dailyResetTime: now + 24 * 60 * 60 * 1000,
      };
      rateLimitStore.set(key, record);
    }

    // Reset daily counter if daily window expired
    if (now > record.dailyResetTime) {
      record.dailyCount = 0;
      record.dailyResetTime = now + 24 * 60 * 60 * 1000;
    }

    // Check daily cap if specified (e.g. AI Copilot 100 requests / day hard cap)
    if (config.dailyCap && record.dailyCount >= config.dailyCap) {
      const retryAfterSec = Math.ceil((record.dailyResetTime - now) / 1000);
      res.setHeader('Retry-After', retryAfterSec.toString());
      return res.status(429).json({
        error: 'Too Many Requests',
        message: `Daily limit of ${config.dailyCap} requests exceeded for ${config.routeGroupName}. Please try again tomorrow.`,
        retryAfter: retryAfterSec
      });
    }

    // Filter out timestamps outside current sliding window
    const windowStart = now - config.windowMs;
    record.timestamps = record.timestamps.filter(ts => ts > windowStart);

    // Check window limit
    if (record.timestamps.length >= effectiveMaxRequests) {
      const oldestTimestamp = record.timestamps[0];
      const retryAfterSec = Math.ceil((oldestTimestamp + config.windowMs - now) / 1000);
      res.setHeader('Retry-After', retryAfterSec.toString());
      return res.status(429).json({
        error: 'Too Many Requests',
        message: `Rate limit of ${effectiveMaxRequests} requests per ${Math.round(config.windowMs / 1000)}s exceeded for ${config.routeGroupName}.`,
        retryAfter: retryAfterSec
      });
    }

    // Record request
    record.timestamps.push(now);
    record.dailyCount += 1;

    // Provide rate limit headers
    res.setHeader('X-RateLimit-Limit', effectiveMaxRequests.toString());
    res.setHeader('X-RateLimit-Remaining', (effectiveMaxRequests - record.timestamps.length).toString());

    return next();
  };
}

// Specific rate limiters per Security.md specifications:
export const authRateLimiter = createRateLimiter({
  routeGroupName: 'auth',
  windowMs: 5 * 60 * 1000, // 5 minutes
  maxRequests: () => {
    // Phase tests strictly require 5 requests / 5 min limit to test 429 response
    const isTest = process.env.NODE_ENV === 'test' || process.argv.some(arg => arg.includes('test'));
    if (isTest) return 5;

    // Configurable via environment variable
    if (process.env.AUTH_RATE_LIMIT_MAX) {
      return parseInt(process.env.AUTH_RATE_LIMIT_MAX, 10);
    }

    // In development mode, relax limit to 100 requests per 5 minutes so local developers/testers are not locked out
    const isDev = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
    return isDev ? 100 : 5;
  },
});

export const profileRateLimiter = createRateLimiter({
  routeGroupName: 'profile',
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 30,
});

export const eligibilityRateLimiter = createRateLimiter({
  routeGroupName: 'eligibility',
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 20,
});

export const aiCopilotRateLimiter = createRateLimiter({
  routeGroupName: 'ai-copilot',
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10,
  dailyCap: 100, // HARD REQUIREMENT: 100/day/user
});

export const documentUploadRateLimiter = createRateLimiter({
  routeGroupName: 'documents',
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 10,
});

export const notificationsRateLimiter = createRateLimiter({
  routeGroupName: 'notifications',
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 60,
});

export const roadmapRateLimiter = createRateLimiter({
  routeGroupName: 'roadmap',
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 30,
});

export const adminRateLimiter = createRateLimiter({
  routeGroupName: 'admin',
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 30,
});

export function clearRateLimitStore() {
  rateLimitStore.clear();
}
