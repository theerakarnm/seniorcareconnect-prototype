import { Hono } from 'hono';
import { requireAuth, requireSupplier, requireSupplierOrAdmin } from '../middleware/rbac.middleware';

const supplier = new Hono();

/**
 * Supplier dashboard - Supplier only
 */
supplier.get('/dashboard', requireAuth, requireSupplier, async (c) => {
  const user = (c as any).user;

  return c.json({
    success: true,
    data: {
      message: 'Welcome to supplier dashboard',
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
 * Supplier properties - Supplier only (owner)
 */
supplier.get('/properties', requireAuth, requireSupplier, async (c) => {
  // Implementation to get supplier's properties
  return c.json({
    success: true,
    data: {
      message: 'Supplier properties endpoint',
      properties: [], // Implementation would fetch supplier's properties
    },
  });
});

/**
 * Property management - Supplier or Admin
 */
supplier.get('/properties/:propertyId', requireAuth, requireSupplierOrAdmin, async (c) => {
  const propertyId = c.req.param('propertyId');

  return c.json({
    success: true,
    data: {
      message: `Property details for ${propertyId}`,
      propertyId,
    },
  });
});

/**
 * Booking management - Supplier or Admin
 */
supplier.get('/bookings', requireAuth, requireSupplier, async (c) => {
  // Implementation to get supplier's bookings
  return c.json({
    success: true,
    data: {
      message: 'Supplier bookings endpoint',
      bookings: [], // Implementation would fetch supplier's bookings
    },
  });
});

export default supplier;