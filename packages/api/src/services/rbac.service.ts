import type { JwtPayload } from '../libs/jwt';

export type Permission = string;
export type Resource = string;
export type Role = 'customer' | 'supplier' | 'admin';

// Define permissions for each resource
export const PERMISSIONS = {
  // User management
  USER_CREATE: 'user:create',
  USER_READ: 'user:read',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',

  // Booking management
  BOOKING_CREATE: 'booking:create',
  BOOKING_READ: 'booking:read',
  BOOKING_UPDATE: 'booking:update',
  BOOKING_DELETE: 'booking:delete',

  // Nursing home management
  NURSING_HOME_CREATE: 'nursing_home:create',
  NURSING_HOME_READ: 'nursing_home:read',
  NURSING_HOME_UPDATE: 'nursing_home:update',
  NURSING_HOME_DELETE: 'nursing_home:delete',

  // Supplier management
  SUPPLIER_CREATE: 'supplier:create',
  SUPPLIER_READ: 'supplier:read',
  SUPPLIER_UPDATE: 'supplier:update',
  SUPPLIER_DELETE: 'supplier:delete',

  // Analytics and reports
  ANALYTICS_READ: 'analytics:read',
  ANALYTICS_EXPORT: 'analytics:export',

  // System administration
  SYSTEM_CONFIG: 'system:config',
  SYSTEM_MONITOR: 'system:monitor',
} as const;

// Define role-based permissions
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  customer: [
    PERMISSIONS.USER_READ, // Can read own profile
    PERMISSIONS.USER_UPDATE, // Can update own profile
    PERMISSIONS.BOOKING_CREATE,
    PERMISSIONS.BOOKING_READ, // Can read own bookings
    PERMISSIONS.BOOKING_UPDATE, // Can update own bookings
    PERMISSIONS.NURSING_HOME_READ,
  ],

  supplier: [
    PERMISSIONS.USER_READ, // Can read own profile
    PERMISSIONS.USER_UPDATE, // Can update own profile
    PERMISSIONS.SUPPLIER_READ, // Can read own supplier info
    PERMISSIONS.SUPPLIER_UPDATE, // Can update own supplier info
    PERMISSIONS.NURSING_HOME_CREATE,
    PERMISSIONS.NURSING_HOME_READ,
    PERMISSIONS.NURSING_HOME_UPDATE,
    PERMISSIONS.BOOKING_READ, // Can read bookings for their properties
    PERMISSIONS.BOOKING_UPDATE, // Can update booking status
    PERMISSIONS.ANALYTICS_READ, // Can read their own analytics
  ],

  admin: [
    // Admin has all permissions
    ...Object.values(PERMISSIONS),
  ],
};

export class RBACService {
  /**
   * Check if a user has a specific permission
   */
  static hasPermission(user: JwtPayload, permission: Permission): boolean {
    const userPermissions = ROLE_PERMISSIONS[user.role as Role] || [];
    return userPermissions.includes(permission);
  }

  /**
   * Check if a user has any of the specified permissions
   */
  static hasAnyPermission(user: JwtPayload, permissions: Permission[]): boolean {
    return permissions.some(permission => this.hasPermission(user, permission));
  }

  /**
   * Check if a user has all of the specified permissions
   */
  static hasAllPermissions(user: JwtPayload, permissions: Permission[]): boolean {
    return permissions.every(permission => this.hasPermission(user, permission));
  }

  /**
   * Check if a user has a specific role
   */
  static hasRole(user: JwtPayload, role: Role): boolean {
    return user.role === role;
  }

  /**
   * Check if a user has any of the specified roles
   */
  static hasAnyRole(user: JwtPayload, roles: Role[]): boolean {
    return roles.includes(user.role as Role);
  }

  /**
   * Get all permissions for a user
   */
  static getUserPermissions(user: JwtPayload): Permission[] {
    return ROLE_PERMISSIONS[user.role as Role] || [];
  }

  /**
   * Check if a user can access a specific resource with a specific action
   */
  static canAccessResource(
    user: JwtPayload,
    resource: Resource,
    action: 'create' | 'read' | 'update' | 'delete'
  ): boolean {
    const permission = `${resource}:${action}` as Permission;
    return this.hasPermission(user, permission);
  }

  /**
   * Check if a user can access their own resource
   */
  static canAccessOwnResource(
    user: JwtPayload,
    resourceOwnerId: string
  ): boolean {
    // Users can always access their own resources
    // Admins can access any resource
    return user.userId === resourceOwnerId || user.role === 'admin';
  }

  /**
   * Filter permissions that a user doesn't have from a list
   */
  static filterUnauthorizedPermissions(
    user: JwtPayload,
    requiredPermissions: Permission[]
  ): Permission[] {
    const userPermissions = this.getUserPermissions(user);
    return requiredPermissions.filter(permission =>
      userPermissions.includes(permission)
    );
  }

  /**
   * Check if a user can perform supplier-related operations
   */
  static canPerformSupplierOperations(user: JwtPayload, supplierId?: string): boolean {
    if (user.role === 'admin') return true;
    if (user.role === 'supplier') {
      // For suppliers, we'd need to check if they own the supplier
      // This would require additional database lookup
      return true; // Simplified for now
    }
    return false;
  }

  /**
   * Check if a user can access booking-related operations
   */
  static canAccessBooking(user: JwtPayload, bookingUserId?: string, bookingSupplierId?: string): boolean {
    if (user.role === 'admin') return true;

    if (user.role === 'customer') {
      // Customers can only access their own bookings
      return user.userId === bookingUserId;
    }

    if (user.role === 'supplier') {
      // Suppliers can access bookings for their properties
      // This would require checking if the booking belongs to their supplier
      return true; // Simplified for now
    }

    return false;
  }
}