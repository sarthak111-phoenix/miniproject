import { Request, Response, NextFunction } from 'express';
import { AdminService } from '../services/adminService';
import { prisma } from '../db/store';
import bcrypt from 'bcryptjs';

export class AdminController {
  // Stats
  public static async getDashboardStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await AdminService.getDashboardStats();
      return res.json(stats);
    } catch (err) {
      return next(err);
    }
  }

  // Users
  public static async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const { search, role, status, page, limit } = req.query;
      const data = await AdminService.getUsers({
        search: search as string,
        role: role as string,
        status: status as string,
        page: page ? parseInt(page as string, 10) : 1,
        limit: limit ? parseInt(limit as string, 10) : 15,
      });
      return res.json(data);
    } catch (err) {
      return next(err);
    }
  }

  public static async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await AdminService.getUserById(req.params.id);
      return res.json(user);
    } catch (err) {
      return next(err);
    }
  }

  public static async updateUserStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const admin = req.user!;
      const result = await AdminService.updateUserStatus(req.params.id, req.body.status, admin.userId, admin.email);
      return res.json(result);
    } catch (err) {
      return next(err);
    }
  }

  public static async updateUserRole(req: Request, res: Response, next: NextFunction) {
    try {
      const admin = req.user!;
      const result = await AdminService.updateUserRole(
        req.params.id,
        req.body.role,
        req.body.adminRoleId || null,
        admin.userId,
        admin.email
      );
      return res.json(result);
    } catch (err) {
      return next(err);
    }
  }

  public static async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const admin = req.user!;
      const result = await AdminService.deleteUser(req.params.id, admin.userId, admin.email);
      return res.json(result);
    } catch (err) {
      return next(err);
    }
  }

  public static async exportUsersCsv(req: Request, res: Response, next: NextFunction) {
    try {
      const csv = await AdminService.exportUsersCsv();
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="saarthi_users_export.csv"');
      return res.send(csv);
    } catch (err) {
      return next(err);
    }
  }

  // Scholarships & Schemes
  public static async getSchemes(req: Request, res: Response, next: NextFunction) {
    try {
      const { categoryType, isScholarshipOnly, isWelfareOnly, status, search, page, limit } = req.query;
      const data = await AdminService.getSchemes({
        categoryType: categoryType as string,
        isScholarshipOnly: isScholarshipOnly === 'true',
        isWelfareOnly: isWelfareOnly === 'true',
        status: status as string,
        search: search as string,
        page: page ? parseInt(page as string, 10) : 1,
        limit: limit ? parseInt(limit as string, 10) : 20,
      });
      return res.json(data);
    } catch (err) {
      return next(err);
    }
  }

  public static async getSchemeById(req: Request, res: Response, next: NextFunction) {
    try {
      const scheme = await AdminService.getSchemeById(req.params.id);
      return res.json(scheme);
    } catch (err) {
      return next(err);
    }
  }

  public static async createScheme(req: Request, res: Response, next: NextFunction) {
    try {
      const admin = req.user!;
      const created = await AdminService.createScheme(req.body, admin.userId, admin.email);
      return res.status(201).json(created);
    } catch (err) {
      return next(err);
    }
  }

  public static async updateScheme(req: Request, res: Response, next: NextFunction) {
    try {
      const admin = req.user!;
      const updated = await AdminService.updateScheme(req.params.id, req.body, admin.userId, admin.email);
      return res.json(updated);
    } catch (err) {
      return next(err);
    }
  }

  public static async deleteScheme(req: Request, res: Response, next: NextFunction) {
    try {
      const admin = req.user!;
      const result = await AdminService.deleteScheme(req.params.id, admin.userId, admin.email);
      return res.json(result);
    } catch (err) {
      return next(err);
    }
  }

  // CMS
  public static async getCmsSections(req: Request, res: Response, next: NextFunction) {
    try {
      const sections = await AdminService.getAllCmsSections();
      return res.json({ sections });
    } catch (err) {
      return next(err);
    }
  }

  public static async updateCmsSection(req: Request, res: Response, next: NextFunction) {
    try {
      const admin = req.user!;
      const updated = await AdminService.updateCmsSection(
        req.params.key,
        {
          title: req.body.title,
          contentJson: typeof req.body.content === 'string' ? req.body.content : JSON.stringify(req.body.content),
          status: req.body.status,
        },
        admin.userId,
        admin.email
      );
      return res.json(updated);
    } catch (err) {
      return next(err);
    }
  }

  // Site Config
  public static async getSiteConfig(req: Request, res: Response, next: NextFunction) {
    try {
      const config = await AdminService.getSiteConfig();
      return res.json(config);
    } catch (err) {
      return next(err);
    }
  }

  public static async updateSiteConfig(req: Request, res: Response, next: NextFunction) {
    try {
      const admin = req.user!;
      const updated = await AdminService.updateSiteConfig(req.body, admin.userId, admin.email);
      return res.json(updated);
    } catch (err) {
      return next(err);
    }
  }

  // AI Copilot
  public static async getAiConfig(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AdminService.getAiConfig();
      return res.json(data);
    } catch (err) {
      return next(err);
    }
  }

  public static async updateAiConfig(req: Request, res: Response, next: NextFunction) {
    try {
      const admin = req.user!;
      const updated = await AdminService.updateAiConfig(req.body, admin.userId, admin.email);
      return res.json(updated);
    } catch (err) {
      return next(err);
    }
  }

  public static async testAiPrompt(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AdminService.testAiPrompt(req.body.prompt || 'Hello Saarthi AI Copilot');
      return res.json(result);
    } catch (err) {
      return next(err);
    }
  }

  // Knowledge Base
  public static async getKnowledgeDocs(req: Request, res: Response, next: NextFunction) {
    try {
      const docs = await AdminService.getKnowledgeDocs();
      return res.json({ documents: docs });
    } catch (err) {
      return next(err);
    }
  }

  public static async createKnowledgeDoc(req: Request, res: Response, next: NextFunction) {
    try {
      const admin = req.user!;
      const doc = await AdminService.createKnowledgeDoc(req.body, admin.userId, admin.email);
      return res.status(201).json(doc);
    } catch (err) {
      return next(err);
    }
  }

  public static async deleteKnowledgeDoc(req: Request, res: Response, next: NextFunction) {
    try {
      const admin = req.user!;
      const result = await AdminService.deleteKnowledgeDoc(req.params.id, admin.userId, admin.email);
      return res.json(result);
    } catch (err) {
      return next(err);
    }
  }

  // User Documents
  public static async getUserDocuments(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, status } = req.query;
      const data = await AdminService.getUserDocumentsList({
        page: page ? parseInt(page as string, 10) : 1,
        limit: limit ? parseInt(limit as string, 10) : 20,
        status: status as string,
      });
      return res.json(data);
    } catch (err) {
      return next(err);
    }
  }

  // Announcements
  public static async getAnnouncements(req: Request, res: Response, next: NextFunction) {
    try {
      const announcements = await AdminService.getAnnouncements();
      return res.json({ announcements });
    } catch (err) {
      return next(err);
    }
  }

  public static async createAnnouncement(req: Request, res: Response, next: NextFunction) {
    try {
      const admin = req.user!;
      const created = await AdminService.createAnnouncement(req.body, admin.userId, admin.email);
      return res.status(201).json(created);
    } catch (err) {
      return next(err);
    }
  }

  public static async deleteAnnouncement(req: Request, res: Response, next: NextFunction) {
    try {
      const admin = req.user!;
      const result = await AdminService.deleteAnnouncement(req.params.id, admin.userId, admin.email);
      return res.json(result);
    } catch (err) {
      return next(err);
    }
  }

  // Support Tickets
  public static async getSupportTickets(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, priority, page, limit } = req.query;
      const data = await AdminService.getSupportTickets({
        status: status as string,
        priority: priority as string,
        page: page ? parseInt(page as string, 10) : 1,
        limit: limit ? parseInt(limit as string, 10) : 20,
      });
      return res.json(data);
    } catch (err) {
      return next(err);
    }
  }

  public static async updateSupportTicket(req: Request, res: Response, next: NextFunction) {
    try {
      const admin = req.user!;
      const updated = await AdminService.updateSupportTicket(req.params.id, req.body, admin.userId, admin.email);
      return res.json(updated);
    } catch (err) {
      return next(err);
    }
  }

  // Roles & RBAC
  public static async getRoles(req: Request, res: Response, next: NextFunction) {
    try {
      const roles = await AdminService.getRoles();
      return res.json({ roles });
    } catch (err) {
      return next(err);
    }
  }

  public static async createRole(req: Request, res: Response, next: NextFunction) {
    try {
      const admin = req.user!;
      const role = await AdminService.createRole(req.body, admin.userId, admin.email);
      return res.status(201).json(role);
    } catch (err) {
      return next(err);
    }
  }

  public static async updateRole(req: Request, res: Response, next: NextFunction) {
    try {
      const admin = req.user!;
      const role = await AdminService.updateRole(req.params.id, req.body, admin.userId, admin.email);
      return res.json(role);
    } catch (err) {
      return next(err);
    }
  }

  public static async deleteRole(req: Request, res: Response, next: NextFunction) {
    try {
      const admin = req.user!;
      const result = await AdminService.deleteRole(req.params.id, admin.userId, admin.email);
      return res.json(result);
    } catch (err) {
      return next(err);
    }
  }

  // Audit Logs
  public static async getAuditLogs(req: Request, res: Response, next: NextFunction) {
    try {
      const { module, action, search, page, limit } = req.query;
      const data = await AdminService.getAuditLogs({
        module: module as string,
        action: action as string,
        search: search as string,
        page: page ? parseInt(page as string, 10) : 1,
        limit: limit ? parseInt(limit as string, 10) : 25,
      });
      return res.json(data);
    } catch (err) {
      return next(err);
    }
  }

  public static async exportAuditLogsCsv(req: Request, res: Response, next: NextFunction) {
    try {
      const csv = await AdminService.exportAuditLogsCsv();
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="saarthi_audit_logs.csv"');
      return res.send(csv);
    } catch (err) {
      return next(err);
    }
  }

  // System Health
  public static async getSystemHealth(req: Request, res: Response, next: NextFunction) {
    try {
      const health = await AdminService.getSystemHealth();
      return res.json(health);
    } catch (err) {
      return next(err);
    }
  }

  // Integrations
  public static async getIntegrations(req: Request, res: Response, next: NextFunction) {
    try {
      const integrations = await AdminService.getIntegrations();
      return res.json({ integrations });
    } catch (err) {
      return next(err);
    }
  }

  public static async testIntegration(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AdminService.testIntegration(req.params.key);
      return res.json(result);
    } catch (err) {
      return next(err);
    }
  }

  // Backups
  public static async getBackups(req: Request, res: Response, next: NextFunction) {
    try {
      const backups = await AdminService.listDatabaseBackups();
      return res.json({ backups });
    } catch (err) {
      return next(err);
    }
  }

  public static async createBackup(req: Request, res: Response, next: NextFunction) {
    try {
      const admin = req.user!;
      const backup = await AdminService.createDatabaseBackup(admin.userId, admin.email);
      return res.status(201).json(backup);
    } catch (err) {
      return next(err);
    }
  }

  // Settings
  public static async updatePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const admin = req.user!;
      const { oldPassword, newPassword } = req.body;
      if (!newPassword || newPassword.length < 8) {
        return res.status(400).json({ error: 'Validation Error', message: 'New password must be at least 8 characters long.' });
      }

      const user = await prisma.user.findUnique({ where: { id: admin.userId } });
      if (!user) return res.status(404).json({ error: 'User not found' });

      const isMatch = await bcrypt.compare(oldPassword, user.passwordHash);
      if (!isMatch) {
        return res.status(400).json({ error: 'Authentication Error', message: 'Current password is incorrect.' });
      }

      const salt = await bcrypt.genSalt(10);
      const newHash = await bcrypt.hash(newPassword, salt);

      await prisma.user.update({
        where: { id: admin.userId },
        data: { passwordHash: newHash },
      });

      await AdminService.logAudit({
        adminId: admin.userId,
        adminEmail: admin.email,
        action: 'UPDATE_PASSWORD',
        module: 'settings',
      });

      return res.json({ success: true, message: 'Password updated successfully.' });
    } catch (err) {
      return next(err);
    }
  }

  public static async toggleTwoFactor(req: Request, res: Response, next: NextFunction) {
    try {
      const admin = req.user!;
      const { enabled } = req.body;

      const user = await prisma.user.update({
        where: { id: admin.userId },
        data: {
          twoFactorEnabled: !!enabled,
          twoFactorSecret: enabled ? 'SAARTHI2FASECRETKEY2026MOCK' : null,
        },
      });

      await AdminService.logAudit({
        adminId: admin.userId,
        adminEmail: admin.email,
        action: 'TOGGLE_2FA',
        module: 'settings',
        details: { twoFactorEnabled: user.twoFactorEnabled },
      });

      return res.json({
        twoFactorEnabled: user.twoFactorEnabled,
        secret: user.twoFactorSecret,
      });
    } catch (err) {
      return next(err);
    }
  }

  // Global Search
  public static async globalSearch(req: Request, res: Response, next: NextFunction) {
    try {
      const q = req.query.q as string;
      const results = await AdminService.globalSearch(q);
      return res.json(results);
    } catch (err) {
      return next(err);
    }
  }
}

