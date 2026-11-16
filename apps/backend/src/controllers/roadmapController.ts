import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { RoadmapService } from '../services/roadmapService';

const UpdateMilestoneSchema = z.object({
  status: z.enum(['pending', 'in_progress', 'completed']),
});

const RegenerateSchema = z.object({
  targetGoal: z.string().optional(),
  currentSemester: z.number().min(1).max(8).optional(),
  forceRegenerate: z.boolean().optional(),
});

const AddSkillSchema = z.object({
  skill: z.string().min(1, 'Skill name is required'),
});

export class RoadmapController {
  public static async getRoadmap(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const roadmap = await RoadmapService.getOrGenerateRoadmap(userId);
      return res.status(200).json({ roadmap });
    } catch (err) {
      return next(err);
    }
  }

  public static async regenerateRoadmap(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const parsed = RegenerateSchema.parse(req.body);
      const roadmap = await RoadmapService.regenerateRoadmap(userId, parsed);
      return res.status(200).json({
        message: 'Roadmap regenerated successfully',
        roadmap,
      });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation Error',
          message: err.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', '),
        });
      }
      return next(err);
    }
  }

  public static async getPreview(req: Request, res: Response, next: NextFunction) {
    try {
      const goal = (req.query.goal as string) || 'Full Stack Engineer';
      const semester = req.query.semester ? parseInt(req.query.semester as string, 10) : 1;
      const roadmap = RoadmapService.getPreviewRoadmap(goal, isNaN(semester) ? 1 : semester);
      return res.status(200).json({ roadmap });
    } catch (err) {
      return next(err);
    }
  }

  public static async updateMilestone(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { milestoneId } = req.params;
      const parsed = UpdateMilestoneSchema.parse(req.body);

      const roadmap = await RoadmapService.updateMilestoneStatus(userId, milestoneId, parsed.status);
      return res.status(200).json({
        message: 'Milestone status updated successfully',
        roadmap,
      });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation Error',
          message: err.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', '),
        });
      }
      return next(err);
    }
  }

  public static async toggleSkill(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const parsed = AddSkillSchema.parse(req.body);
      const roadmap = await RoadmapService.addSkillToProfileAndSync(userId, parsed.skill);
      return res.status(200).json({
        message: `Skill '${parsed.skill}' added to profile and roadmap synced`,
        roadmap,
      });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation Error',
          message: err.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', '),
        });
      }
      return next(err);
    }
  }
}
