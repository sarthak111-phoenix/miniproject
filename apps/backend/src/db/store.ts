import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

export const prisma = new PrismaClient();

export interface UserRecord {
  id: string;
  email: string;
  phone?: string;
  passwordHash: string;
  role: 'student' | 'citizen' | 'farmer' | 'admin';
  createdAt: string;
}

export interface ProfileRecord {
  userId: string;
  fullName: string;
  age: number;
  gender: 'male' | 'female' | 'other' | 'all';
  state: string;
  category: 'General' | 'OBC' | 'SC' | 'ST' | 'EWS' | 'Minority' | 'All';
  annualIncome: number;
  occupation: string;
  educationLevel: '10th' | '12th' | 'Diploma' | 'Undergraduate' | 'Postgraduate' | 'Doctorate' | 'None' | 'Other';
  currentCourse?: string;
  currentSemester?: number;
  cgpaOrPercentage?: number;
  skills: string[];
  targetCareerGoal?: string;
  disability: boolean;
  updatedAt: string;
}

export interface ActivityFlagRecord {
  id: string;
  userId?: string;
  ipAddress: string;
  flagType: 'rapid_signups' | 'abnormal_velocity' | 'failed_logins' | 'upload_anomaly' | 'geo_velocity';
  severity: 'low' | 'medium' | 'high';
  details: string;
  createdAt: string;
  status: 'pending_review' | 'resolved' | 'dismissed';
}

class PrismaDbStore {
  private initialized = false;

  constructor() {
    this.init();
  }

  public async init() {
    if (this.initialized) return;
    try {
      await this.seedSchemesIfEmpty();
      this.initialized = true;
    } catch (e) {
      console.error('Error initializing Prisma store:', e);
    }
  }

  private async seedSchemesIfEmpty() {
    try {
      const count = await prisma.scheme.count();
      if (count === 0) {
        const candidates = [
          path.resolve(__dirname, '../../../../packages/scheme-data-schema/dist/starter-schemes.json'),
          path.resolve(__dirname, '../../../../packages/scheme-data-schema/src/starter-schemes.json')
        ];
        for (const p of candidates) {
          if (fs.existsSync(p)) {
            const content = fs.readFileSync(p, 'utf-8');
            const schemes = JSON.parse(content);
            for (const s of schemes) {
              const portalUrl = s.officialPortalUrl || s.portalUrl || 'https://india.gov.in';
              const deadline = s.applicationDeadline || s.deadline || null;
              await prisma.scheme.upsert({
                where: { id: s.id },
                update: {
                  name: s.name,
                  level: s.level,
                  state: s.state || null,
                  categoryType: s.categoryType,
                  benefitAmount: s.benefitAmount,
                  deadline,
                  portalUrl,
                  requiredDocuments: JSON.stringify(s.requiredDocuments || []),
                  sourceVersion: s.sourceVersion,
                  rules: JSON.stringify(s.rules || {})
                },
                create: {
                  id: s.id,
                  name: s.name,
                  level: s.level,
                  state: s.state || null,
                  categoryType: s.categoryType,
                  benefitAmount: s.benefitAmount,
                  deadline,
                  portalUrl,
                  requiredDocuments: JSON.stringify(s.requiredDocuments || []),
                  sourceVersion: s.sourceVersion,
                  rules: JSON.stringify(s.rules || {})
                }
              });
            }
            break;
          }
        }
      }
    } catch (e) {
      console.error('Error seeding schemes:', e);
    }
  }

  // User methods
  public async createUser(user: UserRecord): Promise<UserRecord> {
    await this.init();
    const created = await prisma.user.create({
      data: {
        id: user.id,
        email: user.email.toLowerCase().trim(),
        phone: user.phone || null,
        passwordHash: user.passwordHash,
        role: user.role,
        createdAt: new Date(user.createdAt)
      }
    });

    return {
      id: created.id,
      email: created.email,
      phone: created.phone || undefined,
      passwordHash: created.passwordHash,
      role: created.role as any,
      createdAt: created.createdAt.toISOString()
    };
  }

  public async findUserByEmail(email: string): Promise<UserRecord | null> {
    await this.init();
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });
    if (!user) return null;
    return {
      id: user.id,
      email: user.email,
      phone: user.phone || undefined,
      passwordHash: user.passwordHash,
      role: user.role as any,
      createdAt: user.createdAt.toISOString()
    };
  }

  public async findUserById(id: string): Promise<UserRecord | null> {
    await this.init();
    const user = await prisma.user.findUnique({
      where: { id }
    });
    if (!user) return null;
    return {
      id: user.id,
      email: user.email,
      phone: user.phone || undefined,
      passwordHash: user.passwordHash,
      role: user.role as any,
      createdAt: user.createdAt.toISOString()
    };
  }

  // Profile methods
  public async upsertProfile(profile: ProfileRecord): Promise<ProfileRecord> {
    await this.init();
    const skillsJson = JSON.stringify(profile.skills || []);
    const updated = await prisma.profile.upsert({
      where: { userId: profile.userId },
      update: {
        fullName: profile.fullName,
        age: profile.age,
        gender: profile.gender,
        state: profile.state,
        category: profile.category,
        annualIncome: profile.annualIncome,
        occupation: profile.occupation,
        educationLevel: profile.educationLevel,
        currentCourse: profile.currentCourse || null,
        currentSemester: profile.currentSemester || null,
        cgpaOrPercentage: profile.cgpaOrPercentage || null,
        skills: skillsJson,
        targetCareerGoal: profile.targetCareerGoal || null,
        disability: profile.disability,
        updatedAt: new Date()
      },
      create: {
        userId: profile.userId,
        fullName: profile.fullName,
        age: profile.age,
        gender: profile.gender,
        state: profile.state,
        category: profile.category,
        annualIncome: profile.annualIncome,
        occupation: profile.occupation,
        educationLevel: profile.educationLevel,
        currentCourse: profile.currentCourse || null,
        currentSemester: profile.currentSemester || null,
        cgpaOrPercentage: profile.cgpaOrPercentage || null,
        skills: skillsJson,
        targetCareerGoal: profile.targetCareerGoal || null,
        disability: profile.disability
      }
    });

    let skillsArr: string[] = [];
    try {
      skillsArr = JSON.parse(updated.skills);
    } catch {
      skillsArr = [];
    }

    return {
      userId: updated.userId,
      fullName: updated.fullName,
      age: updated.age,
      gender: updated.gender as any,
      state: updated.state,
      category: updated.category as any,
      annualIncome: updated.annualIncome,
      occupation: updated.occupation,
      educationLevel: updated.educationLevel as any,
      currentCourse: updated.currentCourse || undefined,
      currentSemester: updated.currentSemester || undefined,
      cgpaOrPercentage: updated.cgpaOrPercentage || undefined,
      skills: skillsArr,
      targetCareerGoal: updated.targetCareerGoal || undefined,
      disability: updated.disability,
      updatedAt: updated.updatedAt.toISOString()
    };
  }

  public async findProfileByUserId(userId: string): Promise<ProfileRecord | null> {
    await this.init();
    const p = await prisma.profile.findUnique({
      where: { userId }
    });
    if (!p) return null;

    let skillsArr: string[] = [];
    try {
      skillsArr = JSON.parse(p.skills);
    } catch {
      skillsArr = [];
    }

    return {
      userId: p.userId,
      fullName: p.fullName,
      age: p.age,
      gender: p.gender as any,
      state: p.state,
      category: p.category as any,
      annualIncome: p.annualIncome,
      occupation: p.occupation,
      educationLevel: p.educationLevel as any,
      currentCourse: p.currentCourse || undefined,
      currentSemester: p.currentSemester || undefined,
      cgpaOrPercentage: p.cgpaOrPercentage || undefined,
      skills: skillsArr,
      targetCareerGoal: p.targetCareerGoal || undefined,
      disability: p.disability,
      updatedAt: p.updatedAt.toISOString()
    };
  }

  // Activity Flagging
  public async recordActivityFlag(flag: Omit<ActivityFlagRecord, 'id' | 'createdAt' | 'status'>): Promise<ActivityFlagRecord> {
    await this.init();
    const created = await prisma.activityFlag.create({
      data: {
        userId: flag.userId || null,
        ipAddress: flag.ipAddress,
        flagType: flag.flagType,
        severity: flag.severity,
        details: flag.details,
        status: 'pending_review'
      }
    });

    return {
      id: created.id,
      userId: created.userId || undefined,
      ipAddress: created.ipAddress,
      flagType: created.flagType as any,
      severity: created.severity as any,
      details: created.details,
      createdAt: created.createdAt.toISOString(),
      status: created.status as any
    };
  }

  public async getActivityFlags(): Promise<ActivityFlagRecord[]> {
    await this.init();
    const flags = await prisma.activityFlag.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return flags.map(f => ({
      id: f.id,
      userId: f.userId || undefined,
      ipAddress: f.ipAddress,
      flagType: f.flagType as any,
      severity: f.severity as any,
      details: f.details,
      createdAt: f.createdAt.toISOString(),
      status: f.status as any
    }));
  }

  // Schemes
  public async getAllSchemes(): Promise<any[]> {
    await this.init();
    const schemes = await prisma.scheme.findMany();
    return schemes.map(s => {
      let requiredDocs = [];
      let rules = {};
      try { requiredDocs = JSON.parse(s.requiredDocuments); } catch {}
      try { rules = JSON.parse(s.rules); } catch {}
      return {
        id: s.id,
        name: s.name,
        level: s.level,
        state: s.state || undefined,
        categoryType: s.categoryType,
        benefitAmount: s.benefitAmount,
        deadline: s.deadline || undefined,
        applicationDeadline: s.deadline || undefined,
        portalUrl: s.portalUrl,
        officialPortalUrl: s.portalUrl,
        lastVerifiedDate: '2026-08-15',
        requiredDocuments: requiredDocs,
        sourceVersion: s.sourceVersion,
        rules
      };
    });
  }

  public async findSchemeById(id: string): Promise<any | null> {
    await this.init();
    const s = await prisma.scheme.findUnique({
      where: { id }
    });
    if (!s) return null;
    let requiredDocs = [];
    let rules = {};
    try { requiredDocs = JSON.parse(s.requiredDocuments); } catch {}
    try { rules = JSON.parse(s.rules); } catch {}
    return {
      id: s.id,
      name: s.name,
      level: s.level,
      state: s.state || undefined,
      categoryType: s.categoryType,
      benefitAmount: s.benefitAmount,
      deadline: s.deadline || undefined,
      applicationDeadline: s.deadline || undefined,
      portalUrl: s.portalUrl,
      officialPortalUrl: s.portalUrl,
      lastVerifiedDate: '2026-08-15',
      requiredDocuments: requiredDocs,
      sourceVersion: s.sourceVersion,
      rules
    };
  }

  // Roadmaps
  public async getRoadmap(userId: string): Promise<any | null> {
    await this.init();
    const r = await prisma.roadmap.findUnique({
      where: { userId }
    });
    if (!r) return null;

    try {
      if (r.dataJson && r.dataJson !== '{}') {
        const parsed = JSON.parse(r.dataJson);
        return {
          ...parsed,
          id: r.id,
          userId: r.userId,
          targetGoal: parsed.targetGoal || r.targetCareer,
          course: parsed.course || r.currentCourse || '',
          overallProgressPercentage: r.progressPercentage,
          lastUpdated: r.updatedAt.toISOString()
        };
      }
    } catch {}

    return {
      id: r.id,
      userId: r.userId,
      targetGoal: r.targetCareer,
      course: r.currentCourse || '',
      semesters: [],
      skillGapAnalysis: [],
      overallProgressPercentage: r.progressPercentage,
      lastUpdated: r.updatedAt.toISOString()
    };
  }

  public async saveRoadmap(userId: string, roadmap: any): Promise<any> {
    await this.init();
    const dataJson = JSON.stringify(roadmap);
    const progress = roadmap.overallProgressPercentage ?? roadmap.progressPercentage ?? 0;
    const targetCareer = roadmap.targetGoal || roadmap.targetCareer || 'Software Engineer';
    const currentCourse = roadmap.course || roadmap.currentCourse || null;

    const upserted = await prisma.roadmap.upsert({
      where: { userId },
      update: {
        targetCareer,
        currentCourse,
        progressPercentage: progress,
        dataJson,
        updatedAt: new Date()
      },
      create: {
        userId,
        targetCareer,
        currentCourse,
        progressPercentage: progress,
        dataJson
      }
    });

    return {
      ...roadmap,
      id: upserted.id,
      userId
    };
  }

  // Documents
  public async getUserDocuments(userId: string): Promise<any[]> {
    await this.init();
    const docs = await prisma.userDocument.findMany({
      where: { userId },
      orderBy: { uploadedAt: 'desc' }
    });
    return docs.map(d => ({
      id: d.id,
      userId: d.userId,
      docType: d.docType,
      documentType: d.docType,
      fileName: d.fileName,
      fileUrl: d.fileUrl || undefined,
      status: d.status,
      uploadedAt: d.uploadedAt.toISOString(),
      expiresAt: d.expiresAt?.toISOString() || null,
      consentLogged: d.consentLogged
    }));
  }

  public async addDocument(userId: string, doc: any): Promise<any> {
    await this.init();
    const docType = doc.documentType || doc.docType || 'General Document';
    const created = await prisma.userDocument.create({
      data: {
        id: doc.id || undefined,
        userId,
        docType,
        fileName: doc.fileName || 'document.pdf',
        fileUrl: doc.fileUrl || null,
        status: doc.status || 'uploaded',
        consentLogged: doc.consentLogged !== false,
        expiresAt: doc.expiresAt ? new Date(doc.expiresAt) : null
      }
    });
    return {
      ...doc,
      id: created.id,
      docType,
      documentType: docType,
      uploadedAt: created.uploadedAt.toISOString()
    };
  }

  // Notifications
  public async getUserNotifications(userId: string): Promise<any[]> {
    await this.init();
    const notifs = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    return notifs.map(n => ({
      id: n.id,
      userId: n.userId,
      title: n.title,
      message: n.message,
      type: n.type,
      read: n.isRead,
      isRead: n.isRead,
      actionUrl: n.actionUrl || undefined,
      createdAt: n.createdAt.toISOString()
    }));
  }

  public async markNotificationAsRead(userId: string, notificationId: string): Promise<boolean> {
    await this.init();
    const result = await prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { isRead: true }
    });
    return result.count > 0;
  }

  public async addNotification(userId: string, notification: any): Promise<any> {
    await this.init();
    const created = await prisma.notification.create({
      data: {
        id: notification.id || undefined,
        userId,
        title: notification.title,
        message: notification.message,
        type: notification.type || 'general',
        isRead: notification.read ?? notification.isRead ?? false,
        actionUrl: notification.actionUrl || null
      }
    });
    return {
      ...notification,
      id: created.id,
      read: created.isRead,
      isRead: created.isRead,
      createdAt: created.createdAt.toISOString()
    };
  }

  public async clearAll() {
    try {
      // Only delete automated test run artifacts (never delete administrators or real users)
      const testEmailFilter = {
        OR: [
          { email: { startsWith: 'e2e.' } },
          { email: { startsWith: 'test_' } },
          { email: { startsWith: 'test.' } },
          { email: { contains: 'disposable' } },
          { email: { contains: 'example.com' } },
        ],
      };

      await prisma.roadmapMilestone.deleteMany({});
      await prisma.roadmap.deleteMany({});
      await prisma.userDocument.deleteMany({});
      await prisma.notification.deleteMany({});
      await prisma.activityFlag.deleteMany({});
      await prisma.profile.deleteMany({
        where: { user: testEmailFilter },
      });
      await prisma.user.deleteMany({
        where: testEmailFilter,
      });
      // Keep schemes intact so catalog is always available
      await this.init();
    } catch (e) {
      console.error('Error clearing database:', e);
    }
  }
}

export const db = new PrismaDbStore();
