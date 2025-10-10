import bcrypt from 'bcryptjs';
import db from '../database';
import { user, account, session } from '../database/auth-schema';
import { JwtService, type JwtPayload, type TokenPair } from '../../libs/jwt';
import { eq } from 'drizzle-orm';
import { uuidv7 } from 'uuidv7';

export interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    emailVerified: boolean;
    createdAt: Date;
  };
  tokens: TokenPair;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: string;
  emailVerified: boolean;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class AuthService {
  /**
   * Register a new user
   */
  static async register(data: RegisterInput): Promise<AuthResponse> {
    const { email, password, firstName, lastName, role = 'user' } = data;

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(user)
      .where(eq(user.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    const userId = uuidv7();
    const fullName = `${firstName} ${lastName}`;

    // Create user transaction
    const result = await db.transaction(async (tx) => {
      // Insert user
      const [newUser] = await tx
        .insert(user)
        .values({
          id: userId,
          name: fullName,
          email,
          emailVerified: false,
        })
        .returning();

      // Insert account with password
      await tx.insert(account).values({
        id: uuidv7(),
        accountId: userId,
        providerId: 'credentials',
        userId,
        password: hashedPassword,
      });

      return newUser;
    });

    // Generate tokens
    const tokens = JwtService.generateTokenPair({
      userId: result.id,
      email: result.email,
      role,
    });

    return {
      user: {
        id: result.id,
        email: result.email,
        name: result.name,
        role,
        emailVerified: result.emailVerified,
        createdAt: result.createdAt,
      },
      tokens,
    };
  }

  /**
   * Login user with credentials
   */
  static async login(credentials: LoginInput): Promise<AuthResponse> {
    const { email, password } = credentials;

    // Find user with account
    const userWithAccount = await db
      .select({
        user: user,
        account: account,
      })
      .from(user)
      .leftJoin(account, eq(user.id, account.userId))
      .where(eq(user.email, email))
      .limit(1);

    if (!userWithAccount.length || !userWithAccount[0].user) {
      throw new Error('Invalid email or password');
    }

    const { user: userData, account: accountData } = userWithAccount[0];

    if (!accountData || !accountData.password) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, accountData.password);
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    // Determine user role (you might want to store this in the user table)
    const role = 'user'; // Default role, you can enhance this based on your requirements

    // Generate tokens
    const tokens = JwtService.generateTokenPair({
      userId: userData.id,
      email: userData.email,
      role,
    });

    return {
      user: {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role,
        emailVerified: userData.emailVerified,
        createdAt: userData.createdAt,
      },
      tokens,
    };
  }

  /**
   * Refresh access token using refresh token
   */
  static async refreshToken(refreshToken: string): Promise<TokenPair> {
    const payload = JwtService.verifyRefreshToken(refreshToken);

    // Get user from database
    const userData = await this.getUserById(payload.userId);
    if (!userData) {
      throw new Error('User not found');
    }

    // Generate new tokens
    return JwtService.generateTokenPair({
      userId: userData.id,
      email: userData.email,
      role: userData.role,
    });
  }

  /**
   * Get user by ID
   */
  static async getUserById(userId: string): Promise<UserProfile | null> {
    const [userData] = await db
      .select()
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    if (!userData) {
      return null;
    }

    // Determine role (you might want to enhance this based on your requirements)
    const role = 'user'; // Default role

    return {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      role,
      emailVerified: userData.emailVerified,
      image: userData.image || undefined,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
    };
  }

  /**
   * Update user profile
   */
  static async updateProfile(
    userId: string,
    updates: {
      firstName?: string;
      lastName?: string;
      email?: string;
    }
  ): Promise<UserProfile> {
    const updateData: Partial<typeof user.$inferInsert> = {};

    if (updates.firstName || updates.lastName) {
      const existingUser = await this.getUserById(userId);
      if (!existingUser) {
        throw new Error('User not found');
      }

      const firstName = updates.firstName || existingUser.name.split(' ')[0];
      const lastName = updates.lastName || existingUser.name.split(' ').slice(1).join(' ');
      updateData.name = `${firstName} ${lastName}`.trim();
    }

    if (updates.email) {
      // Check if email is already taken by another user
      const existingUser = await db
        .select()
        .from(user)
        .where(eq(user.email, updates.email))
        .limit(1);

      if (existingUser.length > 0 && existingUser[0].id !== userId) {
        throw new Error('Email is already taken');
      }
      updateData.email = updates.email;
    }

    if (Object.keys(updateData).length === 0) {
      throw new Error('No valid fields to update');
    }

    const [updatedUser] = await db
      .update(user)
      .set(updateData)
      .where(eq(user.id, userId))
      .returning();

    if (!updatedUser) {
      throw new Error('User not found');
    }

    // Determine role
    const role = 'user'; // Default role

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      role,
      emailVerified: updatedUser.emailVerified,
      image: updatedUser.image || undefined,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };
  }

  /**
   * Change user password
   */
  static async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    // Get user account with current password
    const [accountData] = await db
      .select()
      .from(account)
      .where(eq(account.userId, userId))
      .limit(1);

    if (!accountData || !accountData.password) {
      throw new Error('User account not found');
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(
      currentPassword,
      accountData.password
    );
    if (!isValidPassword) {
      throw new Error('Current password is incorrect');
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await db
      .update(account)
      .set({ password: hashedNewPassword })
      .where(eq(account.id, accountData.id));
  }
}