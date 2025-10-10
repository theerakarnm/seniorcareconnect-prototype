# Role-Based Access Control (RBAC) Implementation

This document explains the RBAC system implemented for the Nursing Home Booking Platform.

## Overview

The RBAC system restricts access to routes and resources based on user roles:
- **customer**: Regular users who can book nursing homes
- **supplier**: Nursing home owners/managers
- **admin**: Platform administrators

## Backend Implementation

### Database Schema

The `user` table includes a `role` field with an enum type:
```sql
CREATE TYPE user_role AS ENUM ('customer', 'supplier', 'admin');
```

### Middleware

Location: `apps/backend/src/middleware/rbac.middleware.ts`

#### Available Middleware

1. **requireAuth** - Requires user to be authenticated
2. **requireRole(roles)** - Requires specific role(s)
3. **requireAdmin** - Admin-only access
4. **requireSupplier** - Supplier-only access
5. **requireCustomer** - Customer-only access
6. **requireSupplierOrAdmin** - Supplier or Admin access
7. **requireCustomerOrAdmin** - Customer or Admin access
8. **requireOwnership(field, allowedRoles)** - Resource ownership check

#### Usage Examples

```typescript
import { requireAuth, requireAdmin, requireSupplierOrAdmin } from '../middleware/rbac.middleware';

// Admin dashboard - Admin only
admin.get('/dashboard', requireAuth, requireAdmin, async (c) => {
  // Handler logic
});

// Supplier properties - Supplier or Admin
supplier.get('/properties', requireAuth, requireSupplierOrAdmin, async (c) => {
  // Handler logic
});

// Resource ownership check
app.get('/bookings/:id', requireAuth, requireOwnership('userId'), async (c) => {
  // Users can only access their own bookings
});
```

## Frontend Implementation

### useRole Hook

Location: `apps/web-internal/app/lib/useRole.ts`

```typescript
import { useRole } from '~/hooks/useRole';

function MyComponent() {
  const {
    role,
    isAuthenticated,
    isAdmin,
    isSupplier,
    canAccessAdmin,
    canAccessSupplier
  } = useRole();

  if (isAdmin) {
    // Admin-specific UI
  }

  return (
    <div>
      {canAccessAdmin && <AdminPanel />}
      {canAccessSupplier && <SupplierPanel />}
    </div>
  );
}
```

### Protected Route Components

Location: `apps/web-internal/app/components/ProtectedRoute.tsx`

#### Available Components

1. **ProtectedRoute** - Generic protection with custom roles
2. **AdminRoute** - Admin-only routes
3. **SupplierRoute** - Supplier-only routes
4. **CustomerRoute** - Customer-only routes
5. **SupplierOrAdminRoute** - Supplier or Admin routes
6. **CustomerOrAdminRoute** - Customer or Admin routes

#### Usage Examples

```tsx
import { AdminRoute, SupplierOrAdminRoute } from '~/components/ProtectedRoute';

// Admin-only page
export default function AdminDashboard() {
  return (
    <AdminRoute>
      <AdminDashboardContent />
    </AdminRoute>
  );
}

// Supplier or Admin page
export default function SupplierDashboard() {
  return (
    <SupplierOrAdminRoute>
      <SupplierDashboardContent />
    </SupplierOrAdminRoute>
  );
}
```

### Route Protection

Protected routes automatically redirect unauthorized users:

- **Unauthenticated users** → `/login`
- **Unauthorized roles** → `/unauthorized`

## API Endpoints

### Admin Routes
- `GET /api/v1/admin/dashboard` - Admin dashboard (Admin only)
- `GET /api/v1/admin/users` - User management (Admin only)
- `GET /api/v1/admin/settings` - System settings (Admin only)

### Supplier Routes
- `GET /api/v1/supplier/dashboard` - Supplier dashboard (Supplier only)
- `GET /api/v1/supplier/properties` - Supplier properties (Supplier only)
- `GET /api/v1/supplier/bookings` - Supplier bookings (Supplier only)
- `GET /api/v1/supplier/properties/:id` - Property details (Supplier or Admin)

## Error Handling

### Unauthorized (401)
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required"
  }
}
```

### Forbidden (403)
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Access denied. Required role(s): admin"
  }
}
```

## Testing

Run the RBAC tests:
```bash
cd apps/backend
bun test src/core/auth/__test__/rbac.test.ts
```

## Migration

To update the database with the new role field:
```bash
cd apps/backend
bun run db:migrate
```

## Demo Accounts

For testing purposes, you can use these demo accounts:

- **Admin**: admin@example.com / password
- **Supplier**: supplier@example.com / password
- **Customer**: customer@example.com / password

## Best Practices

1. **Always check permissions on both client and server side**
2. **Use the most restrictive role necessary**
3. **Implement resource ownership checks for user data**
4. **Log access attempts to protected resources**
5. **Regular audit of role assignments and permissions**

## Future Enhancements

1. **Permission-based system** - More granular permissions beyond roles
2. **Role expiration** - Time-based role assignments
3. **Multi-tenancy** - Organization-based access control
4. **Audit logging** - Detailed access logging
5. **Role hierarchy** - Inherited permissions between roles