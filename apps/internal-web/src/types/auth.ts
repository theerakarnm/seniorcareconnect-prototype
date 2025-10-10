import type { UserRole } from "@acme/db";

declare module "@acme/auth" {
  interface User {
    role: UserRole;
  }
}