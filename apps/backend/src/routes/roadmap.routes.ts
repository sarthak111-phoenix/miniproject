import { Router } from 'express';
import { RoadmapController } from '../controllers/roadmapController';
import { requireAuth } from '../middleware/auth.middleware';
import { roadmapRateLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

// Apply rate limiting per Security.md
router.use(roadmapRateLimiter);

// Public roadmap preview for exploration without authentication
router.get('/preview', RoadmapController.getPreview);

// Protected routes requiring authentication
router.use(requireAuth);

router.get('/me', RoadmapController.getRoadmap);
router.post('/regenerate', RoadmapController.regenerateRoadmap);
router.post('/generate', RoadmapController.regenerateRoadmap);
router.patch('/milestones/:milestoneId', RoadmapController.updateMilestone);
router.post('/milestones/:milestoneId/status', RoadmapController.updateMilestone);
router.post('/skills/toggle', RoadmapController.toggleSkill);

export default router;
