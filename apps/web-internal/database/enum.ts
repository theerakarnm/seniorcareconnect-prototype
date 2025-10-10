import { pgEnum } from "drizzle-orm/pg-core";

// Enums
export const userRoleEnum = pgEnum("user_role", [
  "customer",
  "supplier",
  "admin",
]);
export const qcStatusEnum = pgEnum("qc_status", [
  "pending",
  "approved",
  "rejected",
]);
export const bookingStatusEnum = pgEnum("booking_status", [
  "draft",
  "approved",
  "paid",
  "failed",
]);
export const nursingHomeStatusEnum = pgEnum("nursing_home_status", [
  "draft",
  "live",
  "paused",
]);
export const payoutStatusEnum = pgEnum("payout_status", [
  "draft",
  "approved",
  "paid",
  "failed",
]);
export const pricingModelEnum = pgEnum("pricing_model", [
  "per_night",
  "package",
]);