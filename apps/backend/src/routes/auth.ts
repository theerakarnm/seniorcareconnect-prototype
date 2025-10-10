import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { AuthService } from '../core/services/auth.service';
import { authMiddleware } from '../middleware/auth.middleware';
import { auth } from "../core/auth/better-auth.config";

const authRoute = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null
  }
}>();

// Validation schemas
const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  firstName: z.string().min(1, 'First name is required').max(100, 'First name too long'),
  lastName: z.string().min(1, 'Last name is required').max(100, 'Last name too long'),
  role: z.string().optional(),
});

const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

const updateProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100, 'First name too long').optional(),
  lastName: z.string().min(1, 'Last name is required').max(100, 'Last name too long').optional(),
  email: z.string().email('Invalid email format').optional(),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters long'),
});

authRoute.get("/session", (c) => {
  const session = c.get("session")
  const user = c.get("user")

  if (!user) return c.body(null, 401);
  return c.json({
    session,
    user
  });
});

/**
 * POST /auth/register
 * Register a new user
 */
authRoute.post('/register', zValidator('json', registerSchema), async (c) => {
  try {
    const data = c.req.valid('json');
    const result = await AuthService.register(data);

    return c.json({
      success: true,
      data: result,
    }, 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Registration failed';

    return c.json({
      success: false,
      error: {
        code: 'REGISTRATION_FAILED',
        message,
        timestamp: new Date().toISOString(),
      },
    }, 400);
  }
});

/**
 * POST /auth/login
 * Login user
 */
authRoute.post('/login', zValidator('json', loginSchema), async (c) => {
  try {
    const credentials = c.req.valid('json');
    const result = await AuthService.login(credentials);

    return c.json({
      success: true,
      data: result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Login failed';

    return c.json({
      success: false,
      error: {
        code: 'LOGIN_FAILED',
        message,
        timestamp: new Date().toISOString(),
      },
    }, 401);
  }
});

/**
 * POST /auth/refresh
 * Refresh access token
 */
authRoute.post('/refresh', zValidator('json', refreshTokenSchema), async (c) => {
  try {
    const { refreshToken } = c.req.valid('json');
    const tokens = await AuthService.refreshToken(refreshToken);

    return c.json({
      success: true,
      data: { tokens },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Token refresh failed';

    return c.json({
      success: false,
      error: {
        code: 'TOKEN_REFRESH_FAILED',
        message,
        timestamp: new Date().toISOString(),
      },
    }, 401);
  }
});

/**
 * GET /auth/profile
 * Get current user profile
 */
authRoute.get('/profile', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const profile = await AuthService.getUserById(user.userId);

    if (!profile) {
      return c.json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found',
          timestamp: new Date().toISOString(),
        },
      }, 404);
    }

    return c.json({
      success: true,
      data: { user: profile },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to get profile';

    return c.json({
      success: false,
      error: {
        code: 'PROFILE_FETCH_FAILED',
        message,
        timestamp: new Date().toISOString(),
      },
    }, 500);
  }
});

/**
 * PUT /auth/profile
 * Update user profile
 */
authRoute.put('/profile', authMiddleware, zValidator('json', updateProfileSchema), async (c) => {
  try {
    const user = c.get('user');
    const updates = c.req.valid('json');

    if (!user) return c.json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Unauthorized',
        timestamp: new Date().toISOString(),
      },
    }, 401);

    const updatedProfile = await AuthService.updateProfile(user?.id, updates);

    return c.json({
      success: true,
      data: { user: updatedProfile },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Profile update failed';

    return c.json({
      success: false,
      error: {
        code: 'PROFILE_UPDATE_FAILED',
        message,
        timestamp: new Date().toISOString(),
      },
    }, 400);
  }
});

/**
 * POST /auth/change-password
 * Change user password
 */
authRoute.post('/change-password', authMiddleware, zValidator('json', changePasswordSchema), async (c) => {
  try {
    const user = c.get('user');
    const { currentPassword, newPassword } = c.req.valid('json');

    await AuthService.changePassword(user.userId, currentPassword, newPassword);

    return c.json({
      success: true,
      data: { message: 'Password changed successfully' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Password change failed';

    return c.json({
      success: false,
      error: {
        code: 'PASSWORD_CHANGE_FAILED',
        message,
        timestamp: new Date().toISOString(),
      },
    }, 400);
  }
});

/**
 * POST /auth/logout
 * Logout user (client-side token removal)
 */
authRoute.post('/logout', authMiddleware, async (c) => {
  // In a JWT-based system, logout is typically handled client-side
  // by removing the tokens from storage. This endpoint exists for
  // consistency and potential future token blacklisting.

  return c.json({
    success: true,
    data: { message: 'Logged out successfully' },
  });
});

export default auth;