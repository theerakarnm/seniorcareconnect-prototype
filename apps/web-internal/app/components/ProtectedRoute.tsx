import { Navigate, useLocation } from "react-router";
import { useRole, type UserRole } from "~/hooks/useRole";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole | UserRole[];
  redirectTo?: string;
  fallback?: React.ReactNode;
}

/**
 * Component to protect routes based on user roles
 */
export function ProtectedRoute({
  children,
  allowedRoles,
  redirectTo = "/login",
  fallback,
}: ProtectedRouteProps) {
  const location = useLocation();
  const { isAuthenticated, hasAnyRole, isLoading } = useRole();

  // Show loading state while checking authentication
  if (isLoading) {
    return fallback || <div>Loading...</div>;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If no roles specified, any authenticated user can access
  if (!allowedRoles) {
    return <>{children}</>;
  }

  // Check if user has required role(s)
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  const hasRequiredRole = hasAnyRole(roles);

  // Redirect to login if user doesn't have required role
  if (!hasRequiredRole) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

/**
 * Component for admin-only routes
 */
export function AdminRoute({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles="admin" redirectTo="/unauthorized" fallback={fallback}>
      {children}
    </ProtectedRoute>
  );
}

/**
 * Component for supplier-only routes
 */
export function SupplierRoute({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles="supplier" redirectTo="/unauthorized" fallback={fallback}>
      {children}
    </ProtectedRoute>
  );
}

/**
 * Component for customer-only routes
 */
export function CustomerRoute({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles="customer" redirectTo="/unauthorized" fallback={fallback}>
      {children}
    </ProtectedRoute>
  );
}

/**
 * Component for routes accessible by supplier or admin
 */
export function SupplierOrAdminRoute({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["supplier", "admin"]} redirectTo="/unauthorized" fallback={fallback}>
      {children}
    </ProtectedRoute>
  );
}

/**
 * Component for routes accessible by customer or admin
 */
export function CustomerOrAdminRoute({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["customer", "admin"]} redirectTo="/unauthorized" fallback={fallback}>
      {children}
    </ProtectedRoute>
  );
}