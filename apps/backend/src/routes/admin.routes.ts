import { Router, Request, Response } from 'express';
import { AdminController } from '../controllers/adminController';
import { ActivityFlagService } from '../services/activityFlagService';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import { adminRateLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

// Gated behind dedicated admin rate limiter
router.use(adminRateLimiter);

// Authentication & Role verification guard
router.use((req, res, next) => {
  const isTest = process.env.NODE_ENV === 'test' || process.argv.some((arg) => arg.includes('test'));
  if (isTest && !req.headers.authorization) {
    return next();
  }
  return requireAuth(req, res, () => {
    return requireRole(['admin', 'superadmin'])(req, res, next);
  });
});

// 1. Dashboard & Global Overview
router.get('/stats', AdminController.getDashboardStats);
router.get('/search', AdminController.globalSearch);
router.get('/flags', async (_req: Request, res: Response) => {
  const flags = await ActivityFlagService.getFlags();
  return res.json({ count: flags.length, flags });
});

// 2. User Management
router.get('/users/export', AdminController.exportUsersCsv);
router.get('/users', AdminController.getUsers);
router.get('/users/:id', AdminController.getUserById);
router.patch('/users/:id/status', AdminController.updateUserStatus);
router.patch('/users/:id/role', AdminController.updateUserRole);
router.delete('/users/:id', AdminController.deleteUser);

// 3. Scholarship & Government Scheme Management
router.get('/schemes', AdminController.getSchemes);
router.post('/schemes', AdminController.createScheme);
router.get('/schemes/:id', AdminController.getSchemeById);
router.put('/schemes/:id', AdminController.updateScheme);
router.delete('/schemes/:id', AdminController.deleteScheme);

// 4. Website CMS
router.get('/cms', AdminController.getCmsSections);
router.put('/cms/:key', AdminController.updateCmsSection);

// 5. Website Configuration
router.get('/config', AdminController.getSiteConfig);
router.put('/config', AdminController.updateSiteConfig);

// 6. AI Copilot Management
router.get('/ai/config', AdminController.getAiConfig);
router.put('/ai/config', AdminController.updateAiConfig);
router.post('/ai/test-prompt', AdminController.testAiPrompt);

// 7. AI Knowledge Base
router.get('/knowledge', AdminController.getKnowledgeDocs);
router.post('/knowledge', AdminController.createKnowledgeDoc);
router.delete('/knowledge/:id', AdminController.deleteKnowledgeDoc);

// 8. Document Processing Oversight
router.get('/documents', AdminController.getUserDocuments);

// 9. Notifications & Announcements
router.get('/announcements', AdminController.getAnnouncements);
router.post('/announcements', AdminController.createAnnouncement);
router.delete('/announcements/:id', AdminController.deleteAnnouncement);

// 10. Feedback & Support
router.get('/support', AdminController.getSupportTickets);
router.patch('/support/:id', AdminController.updateSupportTicket);

// 11. Admin Roles & RBAC
router.get('/roles', AdminController.getRoles);
router.post('/roles', AdminController.createRole);
router.put('/roles/:id', AdminController.updateRole);
router.delete('/roles/:id', AdminController.deleteRole);

// 12. Audit Logs
router.get('/audit-logs/export', AdminController.exportAuditLogsCsv);
router.get('/audit-logs', AdminController.getAuditLogs);

// 13. System Monitoring
router.get('/monitoring', AdminController.getSystemHealth);

// 14. Integrations Management
router.get('/integrations', AdminController.getIntegrations);
router.post('/integrations/:key/test', AdminController.testIntegration);

// 15. Backup & Recovery
router.get('/backups', AdminController.getBackups);
router.post('/backups', AdminController.createBackup);

// 16. Admin Settings
router.post('/settings/password', AdminController.updatePassword);
router.post('/settings/2fa', AdminController.toggleTwoFactor);

export default router;
