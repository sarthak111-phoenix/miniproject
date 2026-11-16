import { db, ProfileRecord } from '../db/store';

export interface UpsertProfileDto {
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
}

export class ProfileService {
  public static async getProfile(userId: string): Promise<ProfileRecord | null> {
    return db.findProfileByUserId(userId);
  }

  public static async upsertProfile(dto: UpsertProfileDto): Promise<ProfileRecord> {
    const existing = await db.findProfileByUserId(dto.userId);

    const record: ProfileRecord = {
      ...dto,
      skills: Array.isArray(dto.skills) ? dto.skills : [],
      updatedAt: new Date().toISOString()
    };

    const saved = await db.upsertProfile(record);
    return saved;
  }
}
