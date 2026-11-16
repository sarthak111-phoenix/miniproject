import { db } from '../db/store';
import { RuleEngine, RuleEvaluationResult } from './ruleEngine/evaluator';
import { ProfileService } from './profileService';
import { MySchemeService, MySchemeSummary, MySchemeDetail } from './mySchemeService';

export class SchemeService {
  public static async getAllSchemes(filters?: {
    categoryType?: string;
    level?: string;
    state?: string;
  }) {
    let schemes = await db.getAllSchemes();

    if (filters?.categoryType) {
      schemes = schemes.filter((s) => s.categoryType.toLowerCase() === filters.categoryType?.toLowerCase());
    }
    if (filters?.level) {
      schemes = schemes.filter((s) => s.level.toLowerCase() === filters.level?.toLowerCase());
    }
    if (filters?.state) {
      schemes = schemes.filter(
        (s) => !s.state || s.state.toLowerCase() === filters.state?.toLowerCase() || s.level === 'Central'
      );
    }

    return schemes;
  }

  public static async getSchemeById(id: string) {
    return db.findSchemeById(id);
  }

  public static async checkUserEligibility(userId: string): Promise<{
    userSummary: { name: string; category: string; state: string; annualIncome: number; occupation: string };
    totalEvaluated: number;
    eligibleCount: number;
    eligibleSchemes: RuleEvaluationResult[];
    ineligibleSchemes: RuleEvaluationResult[];
  }> {
    const profile = await ProfileService.getProfile(userId);
    if (!profile) {
      const error: any = new Error('User profile not found. Please complete your profile first.');
      error.status = 404;
      throw error;
    }

    const schemes = await db.getAllSchemes();
    const { eligible, ineligible } = RuleEngine.evaluateAll(profile, schemes);

    return {
      userSummary: {
        name: profile.fullName,
        category: profile.category,
        state: profile.state,
        annualIncome: profile.annualIncome,
        occupation: profile.occupation,
      },
      totalEvaluated: schemes.length,
      eligibleCount: eligible.length,
      eligibleSchemes: eligible,
      ineligibleSchemes: ineligible,
    };
  }

  /**
   * Evaluates criteria directly for non-authenticated or custom questionnaire inputs
   */
  public static async checkCriteriaEligibility(criteria: {
    fullName?: string;
    age: number;
    gender: 'male' | 'female' | 'other' | 'all';
    state: string;
    category: 'General' | 'OBC' | 'SC' | 'ST' | 'EWS' | 'Minority' | 'All';
    annualIncome: number;
    occupation?: string;
    educationLevel?: any;
    currentCourse?: string;
    currentSemester?: number;
    cgpaOrPercentage?: number;
    disability?: boolean;
  }): Promise<{
    criteriaSummary: { age: number; gender: string; state: string; category: string; annualIncome: number; occupation: string };
    totalEvaluated: number;
    eligibleCount: number;
    eligibleSchemes: RuleEvaluationResult[];
    ineligibleSchemes: RuleEvaluationResult[];
  }> {
    const syntheticProfile: any = {
      id: 'anonymous-criteria',
      userId: 'anonymous-criteria',
      fullName: criteria.fullName || 'Citizen Candidate',
      age: Number(criteria.age) || 21,
      gender: criteria.gender || 'all',
      state: criteria.state || 'Maharashtra',
      category: criteria.category || 'General',
      annualIncome: Number(criteria.annualIncome) || 0,
      occupation: criteria.occupation || 'citizen',
      educationLevel: criteria.educationLevel || 'Undergraduate',
      currentCourse: criteria.currentCourse || 'General',
      currentSemester: criteria.currentSemester ? Number(criteria.currentSemester) : undefined,
      cgpaOrPercentage: criteria.cgpaOrPercentage ? Number(criteria.cgpaOrPercentage) : 75,
      skills: [],
      disability: Boolean(criteria.disability),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const schemes = await db.getAllSchemes();
    const { eligible, ineligible } = RuleEngine.evaluateAll(syntheticProfile, schemes);

    return {
      criteriaSummary: {
        age: syntheticProfile.age,
        gender: syntheticProfile.gender,
        state: syntheticProfile.state,
        category: syntheticProfile.category,
        annualIncome: syntheticProfile.annualIncome,
        occupation: syntheticProfile.occupation,
      },
      totalEvaluated: schemes.length,
      eligibleCount: eligible.length,
      eligibleSchemes: eligible,
      ineligibleSchemes: ineligible,
    };
  }

  /**
   * Search across verified database schemes and all 5,000+ myscheme.gov.in schemes
   */
  public static async searchAll(query?: string, options?: { limit?: number; offset?: number }) {
    const dbSchemes = await db.getAllSchemes();
    const q = query?.trim().toLowerCase();

    const matchedDb = q
      ? dbSchemes.filter(
          (s) =>
            s.name.toLowerCase().includes(q) ||
            s.categoryType.toLowerCase().includes(q) ||
            (s.state && s.state.toLowerCase().includes(q))
        )
      : dbSchemes;

    const mySchemeResults = await MySchemeService.searchSchemes({
      query: q,
      limit: options?.limit || 40,
      offset: options?.offset || 0,
    });

    return {
      query: q || '',
      verifiedSchemes: matchedDb,
      mySchemeCatalog: mySchemeResults.schemes,
      totalMyScheme: mySchemeResults.total,
    };
  }

  /**
   * Get single scheme details by slug from myScheme.gov.in
   */
  public static async getMySchemeDetail(slug: string): Promise<MySchemeDetail | null> {
    return MySchemeService.getSchemeDetail(slug);
  }
}
