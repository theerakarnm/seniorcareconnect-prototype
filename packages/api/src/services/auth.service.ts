import { auth } from '../libs/auth';
import { db } from '../core/database';
import { user } from '../core/database/schema';
import { eq } from 'drizzle-orm';
import { JwtService, type JwtPayload } from '../libs/jwt';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: 'customer' | 'supplier' | 'admin';
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    emailVerified: boolean;
    kycVerified: boolean;
    createdAt: Date;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export class AuthService {
  /**
   * Register a new user
   */
  static async register(data: RegisterInput): Promise<AuthResponse> {
    const { email, password, firstName, lastName, role = 'customer' } = data;

    // Check if user already exists
    const existingUser = await db.select().from(user).where(eq(user.email, email)).limit(1);
    if (existingUser.length > 0) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user using Better Auth
    const newUser = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name: `${firstName} ${lastName}`,
        role,
        callbackURL: '/', // Optional: where to redirect after email verification
      },
    });

    if (!newUser?.user) {
      throw new Error('Failed to create user');
    }

    // Update user with additional fields using direct DB access
    await db
      .update(user)
      .set({
        role,
        kycVerified: false // Default KYC status
      })
      .where(eq(user.id, newUser.user.id));

    // Get fresh user data
    const createdUser = await db.select().from(user).where(eq(user.id, newUser.user.id)).limit(1);
    if (!createdUser[0]) {
      throw new Error('Failed to retrieve created user');
    }

    // Generate tokens
    const tokens = JwtService.generateTokenPair({
      userId: createdUser[0].id,
      email: createdUser[0].email,
      role: createdUser[0].role,
    });

    return {
      user: {
        id: createdUser[0].id,
        name: createdUser[0].name,
        email: createdUser[0].email,
        role: createdUser[0].role,
        emailVerified: createdUser[0].emailVerified,
        kycVerified: createdUser[0].kycVerified,
        createdAt: createdUser[0].createdAt,
      },
      tokens,
    };
  }

  /**
   * Login user
   */
  static async login(credentials: LoginInput): Promise<AuthResponse> {
    const { email, password } = credentials;

    // Authenticate with Better Auth
    const result = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });

    if (!result?.user) {
      throw new Error('Invalid email or password');
    }

    // Get full user data from database
    const userData = await db.select().from(user).where(eq(user.id, result.user.id)).limit(1);
    if (!userData[0]) {
      throw new Error('User not found');
    }

    // Generate tokens
    const tokens = JwtService.generateTokenPair({
      userId: userData[0].id,
      email: userData[0].email,
      role: userData[0].role,
    });

    return {
      user: {
        id: userData[0].id,
        name: userData[0].name,
        email: userData[0].email,
        role: userData[0].role,
        emailVerified: userData[0].emailVerified,
        kycVerified: userData[0].kycVerified,
        createdAt: userData[0].createdAt,
      },
      tokens,
    };
  }

  /**
   * Refresh access token
   */
  static async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = JwtService.verifyRefreshToken(refreshToken);

    // Get user to ensure they still exist and have the same role
    const userData = await db.select().from(user).where(eq(user.id, payload.userId)).limit(1);
    if (!userData[0]) {
      throw new Error('User not found');
    }

    // Generate new token pair
    const tokens = JwtService.generateTokenPair({
      userId: userData[0].id,
      email: userData[0].email,
      role: userData[0].role,
    });

    return tokens;
  }

  /**
   * Get user by ID
   */
  static async getUserById(userId: string): Promise<AuthResponse['user'] | null> {
    const userData = await db.select().from(user).where(eq(user.id, userId)).limit(1);

    if (!userData[0]) {
      return null;
    }

    return {
      id: userData[0].id,
      name: userData[0].name,
      email: userData[0].email,
      role: userData[0].role,
      emailVerified: userData[0].emailVerified,
      kycVerified: userData[0].kycVerified,
      createdAt: userData[0].createdAt,
    };
  }

  /**
   * Update user profile
   */
  static async updateProfile(
    userId: string,
    updates: Partial<Pick<RegisterInput, 'firstName' | 'lastName' | 'email'>>
  ): Promise<AuthResponse['user']> {
    const updateData: any = {};

    if (updates.firstName || updates.lastName) {
      updateData.name = `${updates.firstName || ''} ${updates.lastName || ''}`.trim();
    }

    if (updates.email) {
      // Check if email is already taken by another user
      const existingUser = await db
        .select()
        .from(user)
        .where(eq(user.email, updates.email))
        .limit(1);

      if (existingUser.length > 0 && existingUser[0].id !== userId) {
        throw new Error('Email is already taken by another user');
      }

      updateData.email = updates.email;
      updateData.emailVerified = false; // Require re-verification for new email
    }

    const updatedUsers = await db
      .update(user)
      .set(updateData)
      .where(eq(user.id, userId))
      .returning();

    if (!updatedUsers[0]) {
      throw new Error('User not found');
    }

    return {
      id: updatedUsers[0].id,
      name: updatedUsers[0].name,
      email: updatedUsers[0].email,
      role: updatedUsers[0].role,
      emailVerified: updatedUsers[0].emailVerified,
      kycVerified: updatedUsers[0].kycVerified,
      createdAt: updatedUsers[0].createdAt,
    };
  }

  /**
   * Change password
   */
  static async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    // Get user with password from account table
    const userData = await db.select().from(user).where(eq(user.id, userId)).limit(1);
    if (!userData[0]) {
      throw new Error('User not found');
    }

    // For password change, we need to verify the current password
    // This would typically involve the account table with stored password
    // For now, we'll use Better Auth's change password functionality
    try {
      await auth.api.changePassword({
        body: {
          currentPassword,
          newPassword,
        },
      });
    } catch (error) {
      throw new Error('Current password is incorrect');
    }
  }

  /**
   * Logout (revoke session)
   */
  static async logout(userId: string): Promise<void> {
    // In a JWT-based system, logout is typically handled client-side
    // Better Auth sessions can be revoked if needed
    try {
      await auth.api.signOut({});
    } catch (error) {
      // Silently ignore logout errors
    }
  }

  /**
   * Verify email
   */
  static async verifyEmail(token: string): Promise<void> {
    try {
      await auth.api.verifyEmail({
        query: {
          token,
        },
      });
    } catch (error) {
      throw new Error('Invalid or expired verification token');
    }
  }

  /**
   * Request password reset
   */
  static async requestPasswordReset(email: string): Promise<void> {
    try {
      await auth.api.forgetPassword({
        body: {
          email,
          redirectTo: '/reset-password',
        },
      });
    } catch (error) {
      // Don't reveal if email exists or not
      // Always return success to prevent email enumeration
    }
  }

  /**
   * Reset password
   */
  static async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      await auth.api.resetPassword({
        body: {
          token,
          newPassword,
        },
      });
    } catch (error) {
      throw new Error('Invalid or expired reset token');
    }
  }
}