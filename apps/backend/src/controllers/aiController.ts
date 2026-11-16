import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AiClient } from '../services/aiClient/client';

const ExplainSchema = z.object({
  schemeId: z.string().min(1, 'Scheme ID is required'),
});

const ChatSchema = z
  .object({
    query: z.string().optional(),
    message: z.string().optional(),
    history: z
      .array(
        z.object({
          role: z.enum(['user', 'assistant', 'system']),
          content: z.string(),
        })
      )
      .optional(),
  })
  .refine((data) => !!(data.query?.trim() || data.message?.trim()), {
    message: 'Either query or message is required',
  });

export class AiController {
  public static async explain(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = ExplainSchema.parse(req.body);
      const userId = req.user!.userId;

      const result = await AiClient.explain({
        schemeId: parsed.schemeId,
        userId,
      });

      return res.status(200).json(result);
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

  public static async chat(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = ChatSchema.parse(req.body);
      const userQuery = (parsed.query || parsed.message || '').trim();
      const userId = req.user?.userId || 'guest';

      const result = await AiClient.chat({
        userId,
        query: userQuery,
        history: parsed.history,
      });

      return res.status(200).json({
        ...result,
        reply: result.answer,
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
