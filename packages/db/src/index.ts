export * from "drizzle-orm/sql";
export { alias } from "drizzle-orm/pg-core";

export type UserRole = "customer" | "supplier" | "admin";
export * from "./schema";
export * from "./auth-schema";