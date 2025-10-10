"use client";

import { useQuery } from "@tanstack/react-query";
import { authClient } from "~/utils/auth";

type UserRole = "customer" | "supplier" | "admin";

interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  role: UserRole;
}

interface Session {
  user: User | null;
}

export function useRole() {
  const {
    data: session,
    isLoading,
    error,
  } = useQuery<Session>({
    queryKey: ["auth-session"],
    queryFn: async () => {
      const response = await authClient.getSession();
      return response.data as unknown as Session;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  const user = session?.user;
  const role = user?.role;

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