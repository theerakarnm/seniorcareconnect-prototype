"use client";

import { useQuery } from "@tanstack/react-query";
import type { UserRole } from "@acme/db";

export function useRole() {
  const {
    data: session,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["auth-session"],
    queryFn: async () => {
      const response = await fetch("/api/auth/session");
      if (!response.ok) {
        throw new Error("Failed to fetch session");
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  const user = session?.user;
  const role = user?.role as UserRole | undefined;

  return {
    user,
    role,
    isLoading,
    error,
    isAuthenticated: !!user,
    isAdmin: role === "admin",
    isSupplier: role === "supplier",
    isCustomer: role === "customer",
    hasRole: (requiredRole: UserRole) => role === requiredRole,
    hasAnyRole: (requiredRoles: UserRole[]) =>
      requiredRoles.includes(role as UserRole),
  };
}