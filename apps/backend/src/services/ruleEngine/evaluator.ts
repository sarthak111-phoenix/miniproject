import { ProfileRecord } from '../../db/store';

export interface SchemeRuleCriteria {
  minAge?: number;
  maxAge?: number;
  genders?: ('male' | 'female' | 'other' | 'all')[];
  allowedStates?: string[];
  allowedCategories?: ('General' | 'OBC' | 'SC' | 'ST' | 'EWS' | 'Minority' | 'All')[];
  maxAnnualIncome?: number;
  minEducationLevel?: '10th' | '12th' | 'Diploma' | 'Undergraduate' | 'Postgraduate' | 'Doctorate' | 'None' | 'Other';
  eligibleOccupations?: string[];
  minMarksPercentage?: number;
  disabilityRequired?: boolean;
}

export interface RuleEvaluationResult {
  schemeId: string;
  schemeName: string;
  isEligible: boolean;
  matchedCriteria: string[];
  disqualifyingReasons: string[];
  requiredDocuments: string[];
  officialPortalUrl: string;
  benefitAmount: string;
  applicationDeadline?: string;
  categoryType: string;
  level: string;
}

const EDUCATION_HIERARCHY: Record<string, number> = {
  None: 0,
  Other: 1,
  '10th': 2,
  '12th': 3,
  Diploma: 4,
  Undergraduate: 5,
  Postgraduate: 6,
  Doctorate: 7,
};

export class RuleEngine {
  public static evaluate(profile: ProfileRecord, scheme: any): RuleEvaluationResult {
    const rules: SchemeRuleCriteria = scheme.rules || {};
    const matchedCriteria: string[] = [];
    const disqualifyingReasons: string[] = [];

    // 1. Age Rule
    if (rules.minAge !== undefined && profile.age < rules.minAge) {
      disqualifyingReasons.push(`Age ${profile.age} is below minimum requirement of ${rules.minAge} years.`);
    } else if (rules.minAge !== undefined) {
      matchedCriteria.push(`Meets minimum age requirement (>= ${rules.minAge}).`);
    }

    if (rules.maxAge !== undefined && profile.age > rules.maxAge) {
      disqualifyingReasons.push(`Age ${profile.age} exceeds maximum allowed limit of ${rules.maxAge} years.`);
    } else if (rules.maxAge !== undefined) {
      matchedCriteria.push(`Meets maximum age limit (<= ${rules.maxAge}).`);
    }

    // 2. Gender Rule
    if (rules.genders && rules.genders.length > 0 && !rules.genders.includes('all')) {
      if (!rules.genders.includes(profile.gender)) {
        disqualifyingReasons.push(`Scheme restricted to ${rules.genders.join(', ')} applicants.`);
      } else {
        matchedCriteria.push(`Gender requirement met (${profile.gender}).`);
      }
    }

    // 3. State / Regional Domicile Rule
    if (rules.allowedStates && rules.allowedStates.length > 0 && !rules.allowedStates.includes('All-India')) {
      if (!rules.allowedStates.includes(profile.state)) {
        disqualifyingReasons.push(`Domicile state ${profile.state} is outside eligible states: ${rules.allowedStates.join(', ')}.`);
      } else {
        matchedCriteria.push(`Domicile verified for ${profile.state}.`);
      }
    } else if (scheme.level === 'Central') {
      matchedCriteria.push('Central scheme applicable across all Indian states/UTs.');
    }

    // 4. Caste / Category Rule
    if (rules.allowedCategories && rules.allowedCategories.length > 0 && !rules.allowedCategories.includes('All')) {
      if (!rules.allowedCategories.includes(profile.category)) {
        disqualifyingReasons.push(`Category ${profile.category} does not match eligible categories: ${rules.allowedCategories.join(', ')}.`);
      } else {
        matchedCriteria.push(`Category ${profile.category} satisfies eligibility quota.`);
      }
    }

    // 5. Income Ceiling Rule
    if (rules.maxAnnualIncome !== undefined) {
      if (profile.annualIncome > rules.maxAnnualIncome) {
        disqualifyingReasons.push(
          `Family annual income (₹${profile.annualIncome.toLocaleString('en-IN')}) exceeds scheme threshold (₹${rules.maxAnnualIncome.toLocaleString('en-IN')}).`
        );
      } else {
        matchedCriteria.push(
          `Family income ₹${profile.annualIncome.toLocaleString('en-IN')} within permissible limit of ₹${rules.maxAnnualIncome.toLocaleString('en-IN')}.`
        );
      }
    }

    // 6. Education Level Rule
    if (rules.minEducationLevel) {
      const userLevelScore = EDUCATION_HIERARCHY[profile.educationLevel] || 0;
      const reqLevelScore = EDUCATION_HIERARCHY[rules.minEducationLevel] || 0;
      if (userLevelScore < reqLevelScore) {
        disqualifyingReasons.push(`Education level '${profile.educationLevel}' does not meet required '${rules.minEducationLevel}'.`);
      } else {
        matchedCriteria.push(`Education qualification '${profile.educationLevel}' satisfies criteria.`);
      }
    }

    // 7. Occupation Rule
    if (rules.eligibleOccupations && rules.eligibleOccupations.length > 0) {
      const userOccupation = profile.occupation.toLowerCase();
      const isEligibleOcc = rules.eligibleOccupations.some(o => o.toLowerCase() === userOccupation);
      if (!isEligibleOcc) {
        disqualifyingReasons.push(`Occupation '${profile.occupation}' is not listed in eligible occupations: ${rules.eligibleOccupations.join(', ')}.`);
      } else {
        matchedCriteria.push(`Occupation verified as ${profile.occupation}.`);
      }
    }

    // 8. Academic Performance / Marks Percentage Rule
    if (rules.minMarksPercentage !== undefined) {
      const userMarks = profile.cgpaOrPercentage || 0;
      if (userMarks < rules.minMarksPercentage) {
        disqualifyingReasons.push(`Academic score (${userMarks}%) is below minimum required (${rules.minMarksPercentage}%).`);
      } else {
        matchedCriteria.push(`Academic score of ${userMarks}% meets merit cut-off (>= ${rules.minMarksPercentage}%).`);
      }
    }

    // 9. Disability Rule
    if (rules.disabilityRequired && !profile.disability) {
      disqualifyingReasons.push('Scheme requires disability certificate/status.');
    }

    const isEligible = disqualifyingReasons.length === 0;

    return {
      schemeId: scheme.id,
      schemeName: scheme.name,
      isEligible,
      matchedCriteria,
      disqualifyingReasons,
      requiredDocuments: scheme.requiredDocuments || [],
      officialPortalUrl: scheme.officialPortalUrl || scheme.portalUrl || 'https://india.gov.in',
      benefitAmount: scheme.benefitAmount,
      applicationDeadline: scheme.applicationDeadline || scheme.deadline,
      categoryType: scheme.categoryType,
      level: scheme.level,
    };
  }

  public static evaluateAll(profile: ProfileRecord, schemes: any[]): {
    eligible: RuleEvaluationResult[];
    ineligible: RuleEvaluationResult[];
  } {
    const eligible: RuleEvaluationResult[] = [];
    const ineligible: RuleEvaluationResult[] = [];

    for (const scheme of schemes) {
      const res = this.evaluate(profile, scheme);
      if (res.isEligible) {
        eligible.push(res);
      } else {
        ineligible.push(res);
      }
    }

    return { eligible, ineligible };
  }
}
