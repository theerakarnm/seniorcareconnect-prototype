import { Context, Next } from 'hono';
import { auth } from '../core/auth/better-auth.config';

export type UserRole = 'customer' | 'supplier' | 'admin';

export interface AuthenticatedContext extends Context {
  user?: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
  };
}

/**
 * Middleware to check if user is authenticated
 */
export const requireAuth = async (c: Context, next: Next) => {
  const session = await auth.api.getSession({
    headers: c.req.header(),
  });

  if (!session?.user) {
    return c.json(
      {
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
        },
      },
      401
    );
  }

  // Attach user info to context
  (c as AuthenticatedContext).user = {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    role: session.user.role as UserRole,
  };

  await next();
};

/**
 * Middleware factory to check if user has specific role(s)
 */
export const requireRole = (allowedRoles: UserRole | UserRole[]) => {
  return async (c: Context, next: Next) => {
    const authenticatedContext = c as AuthenticatedContext;

    if (!authenticatedContext.user) {
      return c.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
          },
        },
        401
      );
    }

    const userRole = authenticatedContext.user.role;
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    if (!roles.includes(userRole)) {
      return c.json(
        {
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: `Access denied. Required role(s): ${roles.join(', ')}`,
          },
        },
        403
      );
    }

    await next();
  };
};

/**
 * Middleware to check if user is admin
 */
export const requireAdmin = requireRole('admin');

/**
 * Middleware to check if user is supplier
 */
export const requireSupplier = requireRole('supplier');

/**
 * Middleware to check if user is customer
 */
export const requireCustomer = requireRole('customer');

/**
 * Middleware to check if user is either supplier or admin
 */
export const requireSupplierOrAdmin = requireRole(['supplier', 'admin']);

/**
 * Middleware to check if user is either customer or admin
 */
export const requireCustomerOrAdmin = requireRole(['customer', 'admin']);

/**
 * Middleware to check if user owns the resource (optional role check)
 */
export const requireOwnership = (
  resourceUserIdField: string = 'userId',
  allowedRoles?: UserRole[]
) => {
  return async (c: Context, next: Next) => {
    const authenticatedContext = c as AuthenticatedContext;

    if (!authenticatedContext.user) {
      return c.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
          },
        },
        401
      );
    }

    const userRole = authenticatedContext.user.role;
    const userId = authenticatedContext.user.id;

    // Check if user has allowed role (if specified)
    if (allowedRoles && allowedRoles.length > 0) {
      if (!allowedRoles.includes(userRole)) {
        return c.json(
          {
            success: false,
            error: {
              code: 'FORBIDDEN',
              message: `Access denied. Required role(s): ${allowedRoles.join(', ')}`,
            },
          },
          403
        );
      }
    }

    // For admin role, skip ownership check
    if (userRole === 'admin') {
      await next();
      return;
    }

    // Get resource user ID from context (this should be set by the route handler)
    const resourceUserId = c.get(resourceUserIdField);

    if (resourceUserId && resourceUserId !== userId) {
      return c.json(
        {
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'Access denied. You do not own this resource.',
          },
        },
        403
      );
    }

    await next();
  };
};