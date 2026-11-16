import { db } from '../db/store';
import { SchemeService } from './schemeService';

export interface NotificationRecord {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'deadline' | 'milestone' | 'scheme_update' | 'digest';
  read: boolean;
  actionUrl?: string;
  createdAt: string;
}

export class NotificationService {
  public static async getUserNotifications(userId: string): Promise<NotificationRecord[]> {
    return db.getUserNotifications(userId);
  }

  public static async markAsRead(userId: string, notificationId: string): Promise<boolean> {
    if ((db as any).markNotificationAsRead) {
      return (db as any).markNotificationAsRead(userId, notificationId);
    }
    const list = await db.getUserNotifications(userId);
    const item = list.find((n: NotificationRecord) => n.id === notificationId);
    if (item) {
      item.read = true;
      return true;
    }
    return false;
  }

  public static async sendNotification(params: {
    userId: string;
    title: string;
    message: string;
    type: 'deadline' | 'milestone' | 'scheme_update' | 'digest';
    actionUrl?: string;
  }): Promise<NotificationRecord> {
    const record: NotificationRecord = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId: params.userId,
      title: params.title,
      message: params.message,
      type: params.type,
      read: false,
      actionUrl: params.actionUrl,
      createdAt: new Date().toISOString(),
    };

    await db.addNotification(params.userId, record);
    return record;
  }

  /**
   * Scans eligible schemes for approaching deadlines and issues alerts
   */
  public static async syncUpcomingDeadlines(userId: string): Promise<NotificationRecord[]> {
    const eligibility = await SchemeService.checkUserEligibility(userId);
    const created: NotificationRecord[] = [];
    const existing = await db.getUserNotifications(userId);

    for (const scheme of eligibility.eligibleSchemes) {
      if (scheme.applicationDeadline) {
        const alreadyNotified = existing.some(
          (n: NotificationRecord) => n.type === 'deadline' && n.message.includes(scheme.schemeName)
        );

        if (!alreadyNotified) {
          const notif = await this.sendNotification({
            userId,
            title: `Deadline Alert: ${scheme.schemeName}`,
            message: `The application deadline for ${scheme.schemeName} is ${scheme.applicationDeadline}. Benefit: ${scheme.benefitAmount}. Ensure your documents are ready!`,
            type: 'deadline',
            actionUrl: scheme.officialPortalUrl,
          });
          created.push(notif);
        }
      }
    }

    return created;
  }

  /**
   * Batches notifications into a single concise digest to prevent notification fatigue
   */
  public static async generateBatchedDigest(userId: string): Promise<NotificationRecord | null> {
    const unread = (await db.getUserNotifications(userId)).filter((n: NotificationRecord) => !n.read && n.type !== 'digest');
    if (unread.length === 0) return null;

    const summaryText = unread.map((n) => `• [${n.type.toUpperCase()}] ${n.title}`).join('\n');

    return this.sendNotification({
      userId,
      title: `Your Saarthi Weekly Digest (${unread.length} updates)`,
      message: `Here is a summary of your pending opportunities and deadlines:\n${summaryText}`,
      type: 'digest',
    });
  }
}
