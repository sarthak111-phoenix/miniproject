import { Request, Response, NextFunction } from 'express';
import { SchemeService } from '../services/schemeService';

export class SchemeController {
  public static async listSchemes(req: Request, res: Response, next: NextFunction) {
    try {
      const { categoryType, level, state } = req.query;
      const schemes = await SchemeService.getAllSchemes({
        categoryType: categoryType as string,
        level: level as string,
        state: state as string,
      });

      return res.status(200).json({
        count: schemes.length,
        schemes,
      });
    } catch (err) {
      return next(err);
    }
  }

  public static async getSchemeDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const scheme = await SchemeService.getSchemeById(id);

      if (!scheme) {
        return res.status(404).json({
          error: 'Not Found',
          message: `Scheme with ID '${id}' was not found.`,
        });
      }

      return res.status(200).json({ scheme });
    } catch (err) {
      return next(err);
    }
  }

  public static async checkEligibility(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const results = await SchemeService.checkUserEligibility(userId);

      return res.status(200).json({
        message: 'Deterministic eligibility evaluation completed',
        ...results,
      });
    } catch (err) {
      return next(err);
    }
  }

  public static async checkCriteriaEligibility(req: Request, res: Response, next: NextFunction) {
    try {
      const criteria = req.body;
      if (!criteria || criteria.age === undefined) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Criteria must include at least age, gender, state, category, and annualIncome.',
        });
      }

      const results = await SchemeService.checkCriteriaEligibility(criteria);
      return res.status(200).json({
        message: 'Eligibility criteria evaluated successfully',
        ...results,
      });
    } catch (err) {
      return next(err);
    }
  }

  public static async searchSchemes(req: Request, res: Response, next: NextFunction) {
    try {
      const { q, limit, offset } = req.query;
      const results = await SchemeService.searchAll(q as string, {
        limit: limit ? Number(limit) : undefined,
        offset: offset ? Number(offset) : undefined,
      });

      return res.status(200).json(results);
    } catch (err) {
      return next(err);
    }
  }

  public static async getMySchemeDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      const detail = await SchemeService.getMySchemeDetail(slug);

      if (!detail) {
        return res.status(404).json({
          error: 'Not Found',
          message: `Scheme with slug '${slug}' not found on myScheme portal.`,
        });
      }

      return res.status(200).json({ scheme: detail });
    } catch (err) {
      return next(err);
    }
  }
}
