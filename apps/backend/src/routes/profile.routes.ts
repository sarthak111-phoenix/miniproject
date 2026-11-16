import { Router } from 'express';
import { ProfileController } from '../controllers/profileController';
import { requireAuth } from '../middleware/auth.middleware';
import { profileRateLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

// Profile routes are authenticated and rate-limited to 30 req/min
router.use(requireAuth);
router.use(profileRateLimiter);

router.get('/me', ProfileController.getProfile);
router.put('/me', ProfileController.upsertProfile);

export default router;
