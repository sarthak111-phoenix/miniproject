import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db, UserRecord } from '../db/store';
import { JWT_SECRET } from '../middleware/auth.middleware';
import { ActivityFlagService } from './activityFlagService';

export interface SignupDto {
  email: string;
  password: string;
  phone?: string;
  role?: 'student' | 'citizen' | 'farmer' | 'admin' | 'superadmin' | string;
  ipAddress: string;
}

export interface LoginDto {
  email: string;
  password: string;
  ipAddress: string;
}

export class AuthService {
  public static async signup(dto: SignupDto): Promise<{ user: Omit<UserRecord, 'passwordHash'>; token: string }> {
    // 1. Check for suspicious activity
    await ActivityFlagService.inspectSignup(dto.ipAddress, dto.email);

    // 2. Check if user already exists
    const existing = await db.findUserByEmail(dto.email);
    if (existing) {
      const error: any = new Error('An account with this email address already exists.');
      error.status = 409;
      throw error;
    }

    // 3. Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(dto.password, salt);

    // 4. Create user - Public signup strictly restricted to citizen tracks (no public admin self-assignment)
    const safeRole = (dto.role && ['student', 'citizen', 'farmer'].includes(dto.role))
      ? dto.role
      : 'student';

    const newUser: UserRecord = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      email: dto.email.toLowerCase().trim(),
      phone: dto.phone,
      passwordHash,
      role: safeRole,
      createdAt: new Date().toISOString(),
    };

    const createdUser = await db.createUser(newUser);

    // 5. Generate token
    const token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email, role: createdUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { passwordHash: _, ...safeUser } = createdUser;
    return { user: safeUser, token };
  }

  public static async login(dto: LoginDto): Promise<{ user: Omit<UserRecord, 'passwordHash'>; token: string }> {
    // 1. Check if account is locked out from repeated failed attempts
    if (ActivityFlagService.isAccountLocked(dto.email)) {
      const error: any = new Error('Account temporarily locked due to multiple failed login attempts. Please try again after 15 minutes.');
      error.status = 429;
      throw error;
    }

    // 2. Lookup user
    const user = await db.findUserByEmail(dto.email);
    if (!user) {
      await ActivityFlagService.recordFailedLogin(dto.email, dto.ipAddress);
      const error: any = new Error('Invalid email or password.');
      error.status = 401;
      throw error;
    }

    // 3. Compare password
    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      await ActivityFlagService.recordFailedLogin(dto.email, dto.ipAddress);
      const error: any = new Error('Invalid email or password.');
      error.status = 401;
      throw error;
    }

    // 4. Reset failed attempts
    ActivityFlagService.recordSuccessfulLogin(dto.email);

    // 5. Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { passwordHash: _, ...safeUser } = user;
    return { user: safeUser, token };
  }
}
