export type UserRole = 'student' | 'citizen' | 'farmer' | 'admin';

export type Gender = 'male' | 'female' | 'other' | 'all';

export type Category = 'General' | 'OBC' | 'SC' | 'ST' | 'EWS' | 'Minority' | 'All';

export type EducationLevel =
  | '10th'
  | '12th'
  | 'Diploma'
  | 'Undergraduate'
  | 'Postgraduate'
  | 'Doctorate'
  | 'None'
  | 'Other';

export interface User {
  id: string;
  email: string;
  phone?: string;
  role: UserRole;
  createdAt: string;
}

export interface UserProfile {
  userId: string;
  fullName: string;
  age: number;
  gender: Gender;
  state: string; // e.g., 'Maharashtra', 'Karnataka', 'All-India'
  category: Category;
  annualIncome: number; // in INR
  occupation: string; // 'student', 'farmer', 'job_seeker', 'homemaker', 'senior_citizen', 'employed'
  educationLevel: EducationLevel;
  currentCourse?: string; // e.g. "B.Tech Computer Science"
  currentSemester?: number;
  cgpaOrPercentage?: number;
  skills: string[];
  targetCareerGoal?: string; // e.g. "Software Engineer"
  disability: boolean;
  updatedAt: string;
}

export interface SchemeRuleCriteria {
  minAge?: number;
  maxAge?: number;
  genders?: Gender[];
  allowedStates?: string[]; // empty or includes 'All-India' for central schemes
  allowedCategories?: Category[];
  maxAnnualIncome?: number; // max income limit in INR
  minEducationLevel?: EducationLevel;
  eligibleOccupations?: string[];
  minMarksPercentage?: number;
  disabilityRequired?: boolean;
}

export interface Scheme {
  id: string;
  slug: string;
  name: string;
  ministryOrDepartment: string;
  level: 'Central' | 'State';
  state?: string;
  categoryType: 'Scholarship' | 'Welfare' | 'Agriculture' | 'Education' | 'Women Empowerment' | 'Skill Development';
  shortDescription: string;
  benefitAmount: string;
  applicationDeadline?: string;
  officialPortalUrl: string;
  requiredDocuments: string[];
  rules: SchemeRuleCriteria;
  sourceVersion: string;
  lastVerifiedDate: string;
}

export interface SchemeEligibilityResult {
  schemeId: string;
  schemeName: string;
  isEligible: boolean;
  matchedCriteria: string[];
  disqualifyingReasons: string[];
  plainExplanation?: string;
  citations?: string[];
  requiredDocuments: string[];
  officialPortalUrl: string;
  applicationDeadline?: string;
  confidenceScore?: number;
}

export interface RoadmapMilestone {
  id: string;
  title: string;
  description: string;
  category: 'core_subject' | 'skill' | 'project' | 'certification' | 'internship';
  status: 'pending' | 'in_progress' | 'completed';
  recommendedResources: { title: string; url: string; isFree: boolean }[];
  targetCompletionMonth: number; // relative to semester
}

export interface RoadmapSemester {
  semesterNumber: number;
  theme: string;
  milestones: RoadmapMilestone[];
}

export interface StudentRoadmap {
  id: string;
  userId: string;
  targetGoal: string;
  generatedDate: string;
  lastUpdated: string;
  semesters: RoadmapSemester[];
  skillGapAnalysis: {
    targetSkill: string;
    currentProficiency: 'missing' | 'beginner' | 'intermediate' | 'advanced';
    recommendedMilestoneId: string;
  }[];
  overallProgressPercentage: number;
}

export interface DocumentUploadItem {
  id: string;
  userId: string;
  fileName: string;
  fileType: string;
  documentType: 'Aadhaar' | 'Income Certificate' | 'Caste Certificate' | 'Marksheet' | 'Domicile' | 'Bank Passbook' | 'Unknown';
  detectedTextSnippet?: string;
  uploadedAt: string;
  verified: boolean;
}

export interface DocumentReadinessReport {
  schemeId: string;
  schemeName: string;
  readinessPercentage: number;
  verifiedDocuments: string[];
  missingDocuments: string[];
  actionSteps: { documentName: string; howToObtain: string }[];
}

export interface ActivityFlag {
  id: string;
  userId?: string;
  ipAddress: string;
  flagType: 'rapid_signups' | 'abnormal_velocity' | 'failed_logins' | 'upload_anomaly' | 'geo_velocity';
  severity: 'low' | 'medium' | 'high';
  details: string;
  createdAt: string;
  status: 'pending_review' | 'resolved' | 'dismissed';
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'deadline' | 'milestone' | 'scheme_update' | 'security';
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}
