import { describe, it, expect, beforeEach, vi } from 'vitest';
import { requireAuth, requireRole, requireAdmin, requireSupplier } from '../../middleware/rbac.middleware';

// Mock the auth module
vi.mock('../../auth/better-auth.config', () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

describe('RBAC Middleware', () => {
  let mockContext: any;
  let mockNext: any;

  beforeEach(() => {
    mockContext = {
      req: {
        header: vi.fn(() => ({})),
      },
      json: vi.fn(),
    };
    mockNext = vi.fn();
  });

  describe('requireAuth', () => {
    it('should return 401 when no session exists', async () => {
      // Mock no session
      const { auth } = await import('../../auth/better-auth.config');
      vi.mocked(auth.api.getSession).mockResolvedValue(null);

      await requireAuth(mockContext, mockNext);

      expect(mockContext.json).toHaveBeenCalledWith(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
          },
        },
        401
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should attach user info and call next when session exists', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'customer',
      };

      // Mock existing session
      const { auth } = await import('../../auth/better-auth.config');
      vi.mocked(auth.api.getSession).mockResolvedValue({
        user: mockUser,
        session: { id: 'session-1' },
      });

      await requireAuth(mockContext, mockNext);

      expect(mockContext.user).toEqual(mockUser);
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('requireRole', () => {
    const adminMiddleware = requireRole('admin');
    const supplierMiddleware = requireRole('supplier');
    const multiRoleMiddleware = requireRole(['admin', 'supplier']);

    beforeEach(() => {
      // Set up authenticated context
      mockContext.user = {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'customer',
      };
    });

    it('should return 403 when user does not have required role', async () => {
      await adminMiddleware(mockContext, mockNext);

      expect(mockContext.json).toHaveBeenCalledWith(
        {
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'Access denied. Required role(s): admin',
          },
        },
        403
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should allow access when user has required role', async () => {
      mockContext.user.role = 'admin';

      await adminMiddleware(mockContext, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockContext.json).not.toHaveBeenCalled();
    });

    it('should allow access when user has one of multiple required roles', async () => {
      mockContext.user.role = 'supplier';

      await multiRoleMiddleware(mockContext, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockContext.json).not.toHaveBeenCalled();
    });
  });

  describe('predefined role middleware', () => {
    beforeEach(() => {
      mockContext.user = {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'customer',
      };
    });

    it('requireAdmin should allow admin users', async () => {
      mockContext.user.role = 'admin';
      await requireAdmin(mockContext, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });

    it('requireAdmin should block non-admin users', async () => {
      await requireAdmin(mockContext, mockNext);
      expect(mockContext.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.objectContaining({
            code: 'FORBIDDEN',
            message: 'Access denied. Required role(s): admin',
          }),
        }),
        403
      );
    });

    it('requireSupplier should allow supplier users', async () => {
      mockContext.user.role = 'supplier';
      await requireSupplier(mockContext, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });

    it('requireSupplier should block non-supplier users', async () => {
      await requireSupplier(mockContext, mockNext);
      expect(mockContext.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.objectContaining({
            code: 'FORBIDDEN',
            message: 'Access denied. Required role(s): supplier',
          }),
        }),
        403
      );
    });
  });
});