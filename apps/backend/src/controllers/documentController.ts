import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { DocumentService } from '../services/documentService';

const ALLOWED_EXTENSIONS = /\.(pdf|jpg|jpeg|png|webp|doc|docx)$/i;

const UploadDocSchema = z
  .object({
    fileName: z
      .string()
      .min(3, 'File name is required')
      .max(255, 'File name too long')
      .refine((val) => !val.includes('..') && !val.includes('/') && !val.includes('\\'), {
        message: 'File name cannot contain path traversal characters',
      })
      .refine((val) => ALLOWED_EXTENSIONS.test(val), {
        message: 'Only PDF, JPG, PNG, WEBP, and DOC/DOCX files are supported',
      }),
    fileSize: z.number().positive().max(10 * 1024 * 1024, 'Max file size is 10MB').default(1024 * 350),
    textSnippet: z.string().optional(),
    consentGiven: z.boolean().optional(),
    userConsent: z.boolean().optional(),
  })
  .refine((data) => data.consentGiven === true || data.userConsent === true, {
    message: 'Explicit user consent is mandatory for document storage and OCR verification',
  });

export class DocumentController {
  public static async upload(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = UploadDocSchema.parse(req.body);
      const userId = req.user!.userId;

      const doc = await DocumentService.uploadDocument({
        userId,
        fileName: parsed.fileName,
        fileSize: parsed.fileSize || 1024 * 350,
        textSnippet: parsed.textSnippet,
        consentGiven: true,
      });

      return res.status(201).json({
        message: 'Document uploaded and classified successfully',
        document: doc,
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

  public static async listUserDocs(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const documents = await DocumentService.getUserDocuments(userId);
      return res.status(200).json({ count: documents.length, documents });
    } catch (err) {
      return next(err);
    }
  }

  public static async checkReadiness(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const schemeId = req.params.schemeId || (req.query.schemeId as string);

      if (!schemeId) {
        return res.status(400).json({ error: 'Bad Request', message: 'schemeId is required' });
      }

      const report = await DocumentService.checkReadiness(userId, schemeId);
      return res.status(200).json({
        report,
        readinessScore: report.readinessPercentage,
        readinessPercentage: report.readinessPercentage,
        isReadyToApply: report.isReadyToApply,
        matchedCount: report.matchedDocuments.length,
        totalRequired: report.matchedDocuments.length + report.missingDocuments.length,
        matchedDocuments: report.matchedDocuments,
        missingDocuments: report.missingDocuments,
      });
    } catch (err) {
      return next(err);
    }
  }
}
