import { Request, Response, NextFunction } from 'express';
import { NotificationService } from '../services/notificationService';

export class NotificationController {
  public static async getNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const notifications = await NotificationService.getUserNotifications(userId);
      const unreadCount = notifications.filter((n) => !n.read).length;

      return res.status(200).json({
        total: notifications.length,
        unreadCount,
        notifications,
      });
    } catch (err) {
      return next(err);
    }
  }

  public static async syncDeadlines(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const created = await NotificationService.syncUpcomingDeadlines(userId);
      return res.status(200).json({
        message: `Synced deadline alerts (${created.length} new reminders generated)`,
        created,
      });
    } catch (err) {
      return next(err);
    }
  }

  public static async markRead(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;
      const success = await NotificationService.markAsRead(userId, id);

      if (!success) {
        return res.status(404).json({
          error: 'Not Found',
          message: `Notification '${id}' not found.`,
        });
      }

      return res.status(200).json({ message: 'Marked as read' });
    } catch (err) {
      return next(err);
    }
  }

  public static async triggerDigest(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const digest = await NotificationService.generateBatchedDigest(userId);
      return res.status(200).json({
        message: digest ? 'Digest created successfully' : 'No unread notifications to digest',
        digest,
      });
    } catch (err) {
      return next(err);
    }
  }
}
