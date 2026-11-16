import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AuthService } from '../services/authService';
import { db } from '../db/store';

const SignupSchema = z.object({
  email: z.string().email('Invalid email address format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
  role: z.enum(['student', 'citizen', 'farmer']).optional(),
});

const LoginSchema = z.object({
  email: z.string().email('Invalid email address format'),
  password: z.string().min(1, 'Password is required'),
});

export class AuthController {
  public static async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = SignupSchema.parse(req.body);
      const ipAddress = req.ip || req.socket.remoteAddress || '127.0.0.1';

      const result = await AuthService.signup({
        ...parsed,
        ipAddress
      });

      return res.status(201).json({
        message: 'Account created successfully',
        ...result
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

  public static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = LoginSchema.parse(req.body);
      const ipAddress = req.ip || req.socket.remoteAddress || '127.0.0.1';

      const result = await AuthService.login({
        ...parsed,
        ipAddress
      });

      return res.status(200).json({
        message: 'Login successful',
        ...result
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

  public static async me(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized', message: 'Not authenticated' });
      }
      const user = await db.findUserById(req.user.userId);
      if (!user) {
        return res.status(404).json({ error: 'Not Found', message: 'User not found' });
      }
      const profile = await db.findProfileByUserId(req.user.userId);
      const { passwordHash: _, ...safeUser } = user;
      return res.status(200).json({
        user: safeUser,
        profile
      });
    } catch (err) {
      return next(err);
    }
  }
}
