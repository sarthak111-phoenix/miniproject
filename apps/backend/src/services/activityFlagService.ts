import { db, ActivityFlagRecord } from '../db/store';

interface SignupAttemptRecord {
  timestamps: number[];
}

interface FailedLoginRecord {
  attempts: number;
  lastAttempt: number;
  lockoutUntil?: number;
}

const signupIpTracker = new Map<string, SignupAttemptRecord>();
const failedLoginTracker = new Map<string, FailedLoginRecord>();

// List of disposable email domains per Security.md
const DISPOSABLE_EMAIL_DOMAINS = new Set([
  'mailinator.com',
  'tempmail.com',
  '10minutemail.com',
  'guerrillamail.com',
  'trashmail.com',
  'yopmail.com',
  'throwawaymail.com'
]);

export class ActivityFlagService {
  public static async inspectSignup(ipAddress: string, email: string): Promise<{ isSuspicious: boolean; reason?: string }> {
    const now = Date.now();
    const domain = email.split('@')[1]?.toLowerCase();

    // 1. Check disposable email
    if (domain && DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
      await db.recordActivityFlag({
        ipAddress,
        flagType: 'rapid_signups',
        severity: 'medium',
        details: `Signup attempt with disposable email domain: ${domain}`
      });
      return { isSuspicious: true, reason: 'Disposable email detected' };
    }

    // 2. Check rapid repeat sign-ups (>3 from same IP within 10 min)
    let ipRecord = signupIpTracker.get(ipAddress);
    if (!ipRecord) {
      ipRecord = { timestamps: [] };
      signupIpTracker.set(ipAddress, ipRecord);
    }
    const tenMinutesAgo = now - 10 * 60 * 1000;
    ipRecord.timestamps = ipRecord.timestamps.filter(ts => ts > tenMinutesAgo);
    ipRecord.timestamps.push(now);

    if (ipRecord.timestamps.length > 3) {
      await db.recordActivityFlag({
        ipAddress,
        flagType: 'rapid_signups',
        severity: 'high',
        details: `Rapid signup velocity: ${ipRecord.timestamps.length} signups within 10 minutes from IP ${ipAddress}`
      });
      return { isSuspicious: true, reason: 'Excessive signup requests from this network' };
    }

    return { isSuspicious: false };
  }

  public static isAccountLocked(email: string): boolean {
    const record = failedLoginTracker.get(email.toLowerCase());
    if (!record || !record.lockoutUntil) return false;
    if (Date.now() < record.lockoutUntil) return true;
    // Reset lockout if time has passed
    record.lockoutUntil = undefined;
    record.attempts = 0;
    return false;
  }

  public static async recordFailedLogin(email: string, ipAddress: string): Promise<void> {
    const normalized = email.toLowerCase();
    const now = Date.now();
    let record = failedLoginTracker.get(normalized);
    if (!record) {
      record = { attempts: 0, lastAttempt: now };
      failedLoginTracker.set(normalized, record);
    }

    // Reset attempts if more than 15 minutes since last attempt
    if (now - record.lastAttempt > 15 * 60 * 1000) {
      record.attempts = 0;
    }

    record.attempts += 1;
    record.lastAttempt = now;

    if (record.attempts >= 5) {
      record.lockoutUntil = now + 15 * 60 * 1000; // 15 minute cooldown
      await db.recordActivityFlag({
        ipAddress,
        flagType: 'failed_logins',
        severity: 'high',
        details: `Account ${email} locked out after 5 consecutive failed login attempts`
      });
    }
  }

  public static recordSuccessfulLogin(email: string): void {
    failedLoginTracker.delete(email.toLowerCase());
  }

  public static clearTrackers(): void {
    failedLoginTracker.clear();
    signupIpTracker.clear();
  }

  public static async getFlags(): Promise<ActivityFlagRecord[]> {
    return db.getActivityFlags();
  }
}
