import { pgEnum } from "drizzle-orm/pg-core";

export const fileTypeEnum = [
  "DOCUMENT",
  "SHEET",
  "PRESENTATION",
  "TEXT",
  "CODE",
  "IMAGE",
  "VIDEO",
  "AUDIO",
  "OTHER",
] as const;

export const platformEnum = [
  'LINE',
  'WeChat',
  'Discord',
  'Telegram',
  'WhatsApp',
  'Slack',
  'Teams',
  'Other',
] as const

// Create a union type from the array
export type FileType = (typeof fileTypeEnum)[number];

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