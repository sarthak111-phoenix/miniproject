import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ProfileService } from '../services/profileService';

const UpsertProfileSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  age: z.number().int().min(5).max(120),
  gender: z.enum(['male', 'female', 'other', 'all']),
  state: z.string().min(2, 'State is required'),
  category: z.enum(['General', 'OBC', 'SC', 'ST', 'EWS', 'Minority', 'All']),
  annualIncome: z.number().nonnegative('Income cannot be negative'),
  occupation: z.string().min(2, 'Occupation is required'),
  educationLevel: z.enum([
    '10th',
    '12th',
    'Diploma',
    'Undergraduate',
    'Postgraduate',
    'Doctorate',
    'None',
    'Other'
  ]),
  currentCourse: z.string().optional(),
  currentSemester: z.number().int().min(1).max(12).optional(),
  cgpaOrPercentage: z.number().min(0).max(100).optional(),
  skills: z.array(z.string()).default([]),
  targetCareerGoal: z.string().optional(),
  disability: z.boolean().default(false),
});

export class ProfileController {
  public static async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const profile = await ProfileService.getProfile(userId);

      if (!profile) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'Profile not found for this user.'
        });
      }

      return res.status(200).json({ profile });
    } catch (err) {
      return next(err);
    }
  }

  public static async upsertProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const parsed = UpsertProfileSchema.parse(req.body);

      const profile = await ProfileService.upsertProfile({
        userId,
        ...parsed
      });

      return res.status(200).json({
        message: 'Profile updated successfully',
        profile
      });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation Error',
          message: err.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
        });
      }
      return next(err);
    }
  }
}
