import { z } from 'zod';

export const GenderSchema = z.enum(['male', 'female', 'other', 'all']);

export const CategorySchema = z.enum(['General', 'OBC', 'SC', 'ST', 'EWS', 'Minority', 'All']);

export const EducationLevelSchema = z.enum([
  '10th',
  '12th',
  'Diploma',
  'Undergraduate',
  'Postgraduate',
  'Doctorate',
  'None',
  'Other'
]);

export const SchemeRuleCriteriaSchema = z.object({
  minAge: z.number().int().min(0).max(120).optional(),
  maxAge: z.number().int().min(0).max(120).optional(),
  genders: z.array(GenderSchema).optional(),
  allowedStates: z.array(z.string()).optional(),
  allowedCategories: z.array(CategorySchema).optional(),
  maxAnnualIncome: z.number().nonnegative().optional(),
  minEducationLevel: EducationLevelSchema.optional(),
  eligibleOccupations: z.array(z.string()).optional(),
  minMarksPercentage: z.number().min(0).max(100).optional(),
  disabilityRequired: z.boolean().optional(),
});

export const SchemeSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(2),
  ministryOrDepartment: z.string().min(2),
  level: z.enum(['Central', 'State']),
  state: z.string().optional(),
  categoryType: z.enum([
    'Scholarship',
    'Welfare',
    'Agriculture',
    'Education',
    'Women Empowerment',
    'Skill Development'
  ]),
  shortDescription: z.string().min(10),
  benefitAmount: z.string().min(1),
  applicationDeadline: z.string().optional(),
  officialPortalUrl: z.string().url(),
  requiredDocuments: z.array(z.string()).min(1),
  rules: SchemeRuleCriteriaSchema,
  sourceVersion: z.string().min(1),
  lastVerifiedDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD'),
});

export type SchemeSchemaType = z.infer<typeof SchemeSchema>;
export type SchemeRuleCriteriaType = z.infer<typeof SchemeRuleCriteriaSchema>;

export function validateScheme(data: unknown): { success: true; data: SchemeSchemaType } | { success: false; errors: string[] } {
  const result = SchemeSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return {
      success: false,
      errors: result.error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
    };
  }
}
