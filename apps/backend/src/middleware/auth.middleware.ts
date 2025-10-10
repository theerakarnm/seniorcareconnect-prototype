import { Context, Next } from 'hono';
import { JwtService, type JwtPayload } from '../libs/jwt';
import { AuthService } from '../core/services/auth.service';

// Extend Hono's context to include user information
declare module 'hono' {
  interface ContextVariableMap {
    user: JwtPayload;
  }
}

export interface AuthenticatedContext extends Context {
  get: {
    (key: 'user'): JwtPayload;
  } & Context['get'];
}

/**
 * Authentication middleware - verifies JWT token
 */
export async function authMiddleware(c: Context, next: Next) {
  try {
    const authHeader = c.req.header('Authorization');
    const token = JwtService.extractTokenFromHeader(authHeader);

    if (!token) {
      return c.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Access token is required',
            timestamp: new Date().toISOString(),
          },
        },
        401
      );
    }

    // Verify token
    const payload = JwtService.verifyAccessToken(token);

    // Verify user still exists
    const user = await AuthService.getUserById(payload.userId);
    if (!user) {
      return c.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'User not found',
            timestamp: new Date().toISOString(),
          },
        },
        401
      );
    }

    // Set user in context
    c.set('user', payload);

    await next();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Authentication failed';
    
    return c.json(
      {
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message,
          timestamp: new Date().toISOString(),
        },
      },
      401
    );
  }
}

/**
 * Role-based authorization middleware
 */
export function requireRole(...allowedRoles: string[]) {
  return async (c: Context, next: Next) => {
    const user = c.get('user');

    if (!user) {
      return c.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
            timestamp: new Date().toISOString(),
          },
        },
        401
      );
    }

    if (!allowedRoles.includes(user.role)) {
      return c.json(
        {
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'Insufficient permissions',
            timestamp: new Date().toISOString(),
          },
        },
        403
      );
    }

    await next();
  };
}

/**
 * Optional authentication middleware - doesn't fail if no token provided
 */
export async function optionalAuthMiddleware(c: Context, next: Next) {
  try {
    const authHeader = c.req.header('Authorization');
    const token = JwtService.extractTokenFromHeader(authHeader);

    if (token) {
      const payload = JwtService.verifyAccessToken(token);
      const user = await AuthService.getUserById(payload.userId);
      
      if (user) {
        c.set('user', payload);
      }
    }
  } catch (error) {
    // Silently ignore authentication errors in optional middleware
  }

  await next();
}

/**
 * Admin role middleware
 */
export const requireAdmin = requireRole('admin');

/**
 * User or Admin role middleware
 */
export const requireUser = requireRole('user', 'admin');