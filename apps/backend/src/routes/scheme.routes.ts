import { Router } from 'express';
import { SchemeController } from '../controllers/schemeController';
import { eligibilityRateLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

// Rate limited per Security.md: 20 requests / min
router.use(eligibilityRateLimiter);

router.get('/', SchemeController.listSchemes);
router.get('/search', SchemeController.searchSchemes);
router.get('/myscheme/:slug', SchemeController.getMySchemeDetail);
router.get('/:id', SchemeController.getSchemeDetails);

export default router;
