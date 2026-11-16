import { Router } from 'express';
import { SchemeController } from '../controllers/schemeController';
import { requireAuth } from '../middleware/auth.middleware';
import { eligibilityRateLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

// Rate limited per Security.md: 20 requests / min
router.use(eligibilityRateLimiter);

// Public criteria evaluation (for anonymous citizens and questionnaire discovery)
router.post('/check-criteria', SchemeController.checkCriteriaEligibility);

// Protected user profile evaluation (strictly requires Bearer Auth per Security.md)
router.use('/check', requireAuth);
router.post('/check', SchemeController.checkEligibility);

export default router;
