import { Router } from 'express';
import { NotificationController } from '../controllers/notificationController';
import { requireAuth } from '../middleware/auth.middleware';
import { notificationsRateLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

router.use(requireAuth);
// Rate limit per Security.md: 60 req / min
router.use(notificationsRateLimiter);

router.get('/me', NotificationController.getNotifications);
router.post('/sync-deadlines', NotificationController.syncDeadlines);
router.patch('/:id/read', NotificationController.markRead);
router.post('/digest', NotificationController.triggerDigest);

export default router;
