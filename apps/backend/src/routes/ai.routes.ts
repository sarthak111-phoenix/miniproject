import { Router } from 'express';
import { AiController } from '../controllers/aiController';
import { requireAuth, optionalAuth } from '../middleware/auth.middleware';
import { aiCopilotRateLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

// Strict AI rate limits per Security.md (10 req/min + 100/day)
router.use(aiCopilotRateLimiter);

// /explain requires an authenticated user with a profile
router.use('/explain', requireAuth);
router.post('/explain', AiController.explain);

// /chat supports both authenticated users and guests
router.post('/chat', optionalAuth, AiController.chat);

export default router;
