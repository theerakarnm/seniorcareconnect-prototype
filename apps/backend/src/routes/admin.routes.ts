import { Hono } from 'hono';
import { requireAuth, requireAdmin } from '../middleware/rbac.middleware';
import { auth } from '~/core/auth/better-auth.config';

const admin = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null
  }
}>();

/**
 * Admin dashboard - Admin only
 */
admin.get('/dashboard', requireAuth, requireAdmin, async (c) => {
  const user = c.get('user')!;
  return c.json({
    success: true,
    data: {
      message: 'Welcome to admin dashboard',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
  });
});

/**
 * User management - Admin only
 */
admin.get('/users', requireAuth, requireAdmin, async (c) => {
  // Implementation to get all users
  return c.json({
    success: true,
    data: {
      message: 'User management endpoint',
      users: [], // Implementation would fetch users from database
    },
  });
});

/**
 * System settings - Admin only
 */
admin.get('/settings', requireAuth, requireAdmin, async (c) => {
  return c.json({
    success: true,
    data: {
      message: 'System settings endpoint',
      settings: {}, // Implementation would fetch system settings
    },
  });
});

export default admin;