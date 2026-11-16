import fs from 'fs';
import path from 'path';
import express from 'express';
import cors from 'cors';

// Auto-load backend .env if not loaded by runner
try {
  const envPath = path.resolve(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
    for (const line of lines) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let val = (match[2] || '').trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.substring(1, val.length - 1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
} catch (_) {}

import authRoutes from './routes/auth.routes';
import profileRoutes from './routes/profile.routes';
import schemeRoutes from './routes/scheme.routes';
import eligibilityRoutes from './routes/eligibility.routes';
import aiRoutes from './routes/ai.routes';
import roadmapRoutes from './routes/roadmap.routes';
import documentRoutes from './routes/document.routes';
import notificationRoutes from './routes/notification.routes';
import adminRoutes from './routes/admin.routes';
import { errorHandler, logger } from './middleware/errorHandler.middleware';

export function createApp() {
  const app = express();

  app.disable('x-powered-by');

  // Security Headers Middleware (OWASP recommended baseline)
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    if (process.env.NODE_ENV === 'production') {
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    }
    next();
  });

  // CORS Configuration
  const defaultAllowed = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://[::1]:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3001',
    'http://localhost:4000',
    'http://127.0.0.1:4000',
    'https://saarthi-ai.vercel.app'
  ];

  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map((s) => s.trim().replace(/\/$/, ''))
    : defaultAllowed;

  // Handle Chrome / Edge Private Network Access preflights
  app.use((req, res, next) => {
    if (req.headers['access-control-request-private-network']) {
      res.setHeader('Access-Control-Allow-Private-Network', 'true');
    }
    next();
  });

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        const normalized = origin.replace(/\/$/, '');
        const isLocalHostOrIp = /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\]|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+)(:\d+)?$/.test(normalized);

        if (
          allowedOrigins.includes(normalized) ||
          isLocalHostOrIp ||
          process.env.NODE_ENV !== 'production' ||
          normalized.endsWith('.vercel.app')
        ) {
          return callback(null, true);
        }
        return callback(new Error(`CORS origin not allowed: ${origin}`));
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Correlation-Id', 'Access-Control-Request-Private-Network'],
    })
  );

  // Body parser with 1MB payload ceiling to prevent memory-exhaustion DoS
  app.use(express.json({ limit: '1mb' }));

  // Correlation ID middleware
  app.use((req, res, next) => {
    const correlationId = (req.headers['x-correlation-id'] as string) || `req-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    req.headers['x-correlation-id'] = correlationId;
    res.setHeader('X-Correlation-Id', correlationId);
    next();
  });

  // Root landing
  app.get('/', (_req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
        <head><title>Saarthi AI Backend</title></head>
        <body style="font-family: system-ui, sans-serif; background: #140505; color: #F8EFE6; text-align: center; padding: 60px 20px;">
          <h1 style="color: #F4A259;">🚀 Saarthi AI Backend API is Running</h1>
          <p style="font-size: 18px; margin-top: 20px;">The Web UI Dashboard is running at:</p>
          <a href="http://localhost:3000" style="display: inline-block; margin-top: 10px; background: #C0392B; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">Open Saarthi Web Dashboard (localhost:3000)</a>
          <p style="margin-top: 30px; color: #A38C7D;">API Status: <a href="/health" style="color: #F4A259;">/health</a></p>
        </body>
      </html>
    `);
  });

  // Health check
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'saarthi-backend', timestamp: new Date().toISOString() });
  });

  // API Route groups
  app.use('/auth', authRoutes);
  app.use('/profile', profileRoutes);
  app.use('/schemes', schemeRoutes);
  app.use('/eligibility', eligibilityRoutes);
  app.use('/ai', aiRoutes);
  app.use('/roadmap', roadmapRoutes);
  app.use('/documents', documentRoutes);
  app.use('/notifications', notificationRoutes);
  app.use('/admin', adminRoutes);
  app.use('/api/admin', adminRoutes);

  // Centralized error handler
  app.use(errorHandler);

  return app;
}

if (require.main === module) {
  const PORT = Number(process.env.PORT) || 4000;
  const HOST = process.env.HOST || '0.0.0.0';
  const app = createApp();
  app.listen(PORT, HOST, () => {
    logger.info(`🚀 Saarthi Backend running at http://localhost:${PORT} (bound to ${HOST})`);
  });
}
