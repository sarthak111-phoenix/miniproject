import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authRateLimiter, clearRateLimitStore } from '../middleware/rateLimit.middleware';
import { requireAuth } from '../middleware/auth.middleware';
import { ActivityFlagService } from '../services/activityFlagService';

const router = Router();

// Apply auth rate limiter per Security.md (5 req / 5 min in prod/tests, relaxed in dev)
router.post('/signup', authRateLimiter, AuthController.signup);
router.post('/login', authRateLimiter, AuthController.login);
router.get('/me', requireAuth, AuthController.me);

// Development utility endpoint to clear rate limit state & lockout tracker
router.post('/reset-limits', (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ error: 'Resetting rate limits is disabled in production' });
  }
  clearRateLimitStore();
  ActivityFlagService.clearTrackers();
  return res.json({ success: true, message: 'Auth rate limits and lockout tracking reset successfully' });
});

export default router;
