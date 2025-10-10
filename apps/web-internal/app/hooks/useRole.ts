import { useAuth } from "./auth";

export type UserRole = 'customer' | 'supplier' | 'admin';

/**
 * Hook to get user role and role-based helper functions
 */
export function useRole() {
  const { user, isLoading } = useAuth();

  const role = user?.role as UserRole | undefined;
  const isAuthenticated = !!user;

  /**
   * Check if user has specific role
   */
  const hasRole = (requiredRole: UserRole): boolean => {
    return role === requiredRole;
  };

  /**
   * Check if user has any of the specified roles
   */
  const hasAnyRole = (requiredRoles: UserRole[]): boolean => {
    return role ? requiredRoles.includes(role) : false;
  };

  /**
   * Check if user is admin
   */
  const isAdmin = hasRole('admin');

  /**
   * Check if user is supplier
   */
  const isSupplier = hasRole('supplier');

  /**
   * Check if user is customer
   */
  const isCustomer = hasRole('customer');

  /**
   * Check if user can access admin routes
   */
  const canAccessAdmin = isAdmin;

  /**
   * Check if user can access supplier routes
   */
  const canAccessSupplier = isSupplier || isAdmin;

  /**
   * Check if user can access customer routes
   */
  const canAccessCustomer = isCustomer || isAdmin;

  return {
    role,
    isLoading,
    isAuthenticated,
    user,
    // Role checks
    hasRole,
    hasAnyRole,
    isAdmin,
    isSupplier,
    isCustomer,
    // Permission checks
    canAccessAdmin,
    canAccessSupplier,
    canAccessCustomer,
  };
}

/**
 * Hook for role-based redirects
 */
export function useRoleRedirect() {
  const { role, isAuthenticated, isLoading } = useRole();

  /**
   * Get redirect path based on user role
   */
  const getRedirectPath = (fallbackPath: string = '/'): string => {
    if (!isAuthenticated) {
      return '/login';
    }

    switch (role) {
      case 'admin':
        return '/admin';
      case 'supplier':
        return '/supplier';
      case 'customer':
        return '/customer';
      default:
        return fallbackPath;
    }
  };

  return {
    role,
    isAuthenticated,
    isLoading,
    getRedirectPath,
  };
}