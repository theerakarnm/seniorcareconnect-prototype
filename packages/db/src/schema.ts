import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import {
  integer,
  pgTable,

  varchar,
  uuid,
  text,
  timestamp,
  decimal,
  date,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import * as authSchema from "./auth-schema";
import * as enums from "./db.enum";

export const guestBook = pgTable("guestBook", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
});

export const supplier = pgTable("supplier", {
  id: uuid("id").primaryKey(),
  ownerUserId: text("owner_user_id")
    .notNull()
    .references(() => authSchema.user.id),
  legalName: text("legal_name").notNull(),
  taxId: text("tax_id"),
  payoutAccountRef: text("payout_account_ref"),
  qcStatus: enums.qcStatusEnum("qc_status").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const nursingHome = pgTable("nursing_home", {
  id: uuid("id").primaryKey(),
  supplierId: uuid("supplier_id")
    .notNull()
    .references(() => supplier.id),
  name: text("name").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  province: text("province").notNull(),
  gps: text("gps"),
  status: enums.nursingHomeStatusEnum("status").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const roomType = pgTable("room_type", {
  id: uuid("id").primaryKey(),
  nursingHomeId: uuid("nursing_home_id")
    .notNull()
    .references(() => nursingHome.id),
  name: text("name").notNull(),
  capacity: integer("capacity").notNull(),
  amenities: text("amenities"),
  policyRef: text("policy_ref"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const ratePlan = pgTable("rate_plan", {
  id: uuid("id").primaryKey(),
  roomTypeId: uuid("room_type_id")
    .notNull()
    .references(() => roomType.id),
  name: text("name").notNull(),
  cancelPolicy: text("cancel_policy"),
  mealPlan: text("meal_plan"),
  pricingModel: enums.pricingModelEnum("pricing_model").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const priceCalendar = pgTable("price_calendar", {
  id: uuid("id").primaryKey(),
  ratePlanId: uuid("rate_plan_id")
    .notNull()
    .references(() => ratePlan.id),
  day: date("day").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  available: integer("available").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const booking = pgTable("booking", {
  id: uuid("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => authSchema.user.id),
  supplierId: uuid("supplier_id")
    .notNull()
    .references(() => supplier.id),
  nursingHomeId: uuid("nursing_home_id")
    .notNull()
    .references(() => nursingHome.id),
  status: enums.bookingStatusEnum("status").notNull(),
  checkIn: date("check_in").notNull(),
  checkOut: date("check_out").notNull(),
  guests: integer("guests").notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull(),
  paymentStatus: text("payment_status"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const bookingItem = pgTable("booking_item", {
  id: uuid("id").primaryKey(),
  bookingId: uuid("booking_id")
    .notNull()
    .references(() => booking.id),
  roomTypeId: uuid("room_type_id")
    .notNull()
    .references(() => roomType.id),
  ratePlanId: uuid("rate_plan_id")
    .notNull()
    .references(() => ratePlan.id),
  nights: integer("nights").notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
});

export const payment = pgTable("payment", {
  id: uuid("id").primaryKey(),
  bookingId: uuid("booking_id")
    .notNull()
    .references(() => booking.id),
  provider: text("provider").notNull(),
  providerRef: text("provider_ref"),
  status: text("status").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const refund = pgTable("refund", {
  id: uuid("id").primaryKey(),
  paymentId: uuid("payment_id")
    .notNull()
    .references(() => payment.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  reason: text("reason"),
  status: text("status").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const payout = pgTable("payout", {
  id: uuid("id").primaryKey(),
  supplierId: uuid("supplier_id")
    .notNull()
    .references(() => supplier.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull(),
  status: enums.payoutStatusEnum("status").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

// Relations
export const userRelations = relations(authSchema.user, ({ many }) => ({
  bookings: many(booking),
}));

export const supplierRelations = relations(supplier, ({ one, many }) => ({
  owner: one(authSchema.user, {
    fields: [supplier.ownerUserId],
    references: [authSchema.user.id],
  }),
  nursingHomes: many(nursingHome),
  payouts: many(payout),
}));

export const nursingHomeRelations = relations(
  nursingHome,
  ({ one, many }) => ({
    supplier: one(supplier, {
      fields: [nursingHome.supplierId],
      references: [supplier.id],
    }),
    roomTypes: many(roomType),
  })
);

export const roomTypeRelations = relations(roomType, ({ one, many }) => ({
  nursingHome: one(nursingHome, {
    fields: [roomType.nursingHomeId],
    references: [nursingHome.id],
  }),
  ratePlans: many(ratePlan),
}));

export const ratePlanRelations = relations(ratePlan, ({ one, many }) => ({
  roomType: one(roomType, {
    fields: [ratePlan.roomTypeId],
    references: [roomType.id],
  }),
  priceCalendar: many(priceCalendar),
}));

export const bookingRelations = relations(booking, ({ one, many }) => ({
  user: one(authSchema.user, {
    fields: [booking.userId],
    references: [authSchema.user.id],
  }),
  supplier: one(supplier, {
    fields: [booking.supplierId],
    references: [supplier.id],
  }),
  nursingHome: one(nursingHome, {
    fields: [booking.nursingHomeId],
    references: [nursingHome.id],
  }),
  items: many(bookingItem),
  payments: many(payment),
}));

export const paymentRelations = relations(payment, ({ one, many }) => ({
  booking: one(booking, {
    fields: [payment.bookingId],
    references: [booking.id],
  }),
  refunds: many(refund),
}));

export * from "./auth-schema";
