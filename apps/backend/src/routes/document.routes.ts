import { Router } from 'express';
import { DocumentController } from '../controllers/documentController';
import { requireAuth } from '../middleware/auth.middleware';
import { documentUploadRateLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

router.use(requireAuth);

// Rate limited to 10 requests / hour per Security.md
router.post('/upload', documentUploadRateLimiter, DocumentController.upload);
router.get('/me', DocumentController.listUserDocs);
router.get('/readiness/:schemeId', DocumentController.checkReadiness);
router.get('/readiness', DocumentController.checkReadiness);

export default router;
