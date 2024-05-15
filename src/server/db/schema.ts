import { relations, sql } from "drizzle-orm";
import {
  integer,
  sqliteTable,
  text,
  primaryKey,
  uniqueIndex,
  foreignKey,
} from "drizzle-orm/sqlite-core";
import { type AdapterAccount } from "next-auth/adapters";

export const users = sqliteTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
  image: text("image"),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  coupons: many(coupons),
}));

export const accounts = sqliteTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = sqliteTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
});

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = sqliteTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);

export const whitelist = sqliteTable("whitelist", {
  email: text("email").notNull().primaryKey(),
});

export const admins = sqliteTable("admins", {
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" })
    .primaryKey(),
});

export const categories = sqliteTable(
  "category",
  {
    id: integer("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
  },
  (table) => ({
    uniqueSlugIndex: uniqueIndex("unique_slug_index").on(table.slug),
  }),
);

export const betTypes = sqliteTable("bet_type", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
});

export type BetType = typeof betTypes.$inferSelect;

export const betTypesRelations = relations(betTypes, ({ many }) => ({
  optionsOnTypes: many(betOptionsOnTypes),
}));

export const betOptions = sqliteTable("bet_option", {
  id: integer("id").primaryKey(),
  value: text("value").notNull(),
});

export type BetOption = typeof betOptions.$inferSelect;

export const betOptionsRelations = relations(betOptions, ({ many }) => ({
  optionsOnTypes: many(betOptionsOnTypes),
}));

export const betOptionsOnTypes = sqliteTable(
  "bet_option_on_type",
  {
    typeId: integer("bet_type_id")
      .notNull()
      .references(() => betTypes.id, { onDelete: "cascade" }),
    optionId: integer("bet_option_id")
      .notNull()
      .references(() => betOptions.id, { onDelete: "cascade" }),
  },
  (table) => ({
    compoundKey: primaryKey({ columns: [table.typeId, table.optionId] }),
  }),
);

export const betOptionsOnTypesRelations = relations(
  betOptionsOnTypes,
  ({ one }) => ({
    type: one(betTypes, {
      fields: [betOptionsOnTypes.typeId],
      references: [betTypes.id],
    }),
    option: one(betOptions, {
      fields: [betOptionsOnTypes.optionId],
      references: [betOptions.id],
    }),
  }),
);

export const events = sqliteTable("event", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  time: integer("time", { mode: "timestamp_ms" }).notNull(),
  categoryId: integer("category_id").notNull(),
  status: text("status", {
    enum: ["upcoming", "live", "finished", "cancelled"],
  })
    .notNull()
    .default("upcoming"),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
});

export const eventsRelations = relations(events, ({ one, many }) => ({
  category: one(categories, {
    fields: [events.categoryId],
    references: [categories.id],
  }),
  betTypesOnEvents: many(betTypesOnEvents),
  odds: many(odds),
}));

export type EventStatus = typeof events.$inferSelect.status;

export const betTypesOnEvents = sqliteTable(
  "bet_type_on_event",
  {
    eventId: text("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    typeId: integer("bet_type_id")
      .notNull()
      .references(() => betTypes.id, { onDelete: "cascade" }),
  },
  (table) => ({
    compoundKey: primaryKey({ columns: [table.eventId, table.typeId] }),
  }),
);

export const betTypesOnEventsRelations = relations(
  betTypesOnEvents,
  ({ one }) => ({
    event: one(events, {
      fields: [betTypesOnEvents.eventId],
      references: [events.id],
    }),
    type: one(betTypes, {
      fields: [betTypesOnEvents.typeId],
      references: [betTypes.id],
    }),
  }),
);

export const odds = sqliteTable(
  "odds",
  {
    eventId: text("event_id").notNull(),
    typeId: integer("bet_type_id")
      .notNull()
      .references(() => betTypes.id, { onDelete: "cascade" }),
    optionId: integer("bet_option_id")
      .notNull()
      .references(() => betOptions.id, {
        onDelete: "cascade",
      }),
    value: integer("value").notNull(),
  },
  (table) => ({
    compoundKey: primaryKey({
      columns: [table.eventId, table.typeId, table.optionId],
    }),
  }),
);

export const oddsRelations = relations(odds, ({ one }) => ({
  event: one(events, {
    fields: [odds.eventId],
    references: [events.id],
  }),
  type: one(betTypes, {
    fields: [odds.typeId],
    references: [betTypes.id],
  }),
  option: one(betOptions, {
    fields: [odds.optionId],
    references: [betOptions.id],
  }),
  optionOnType: one(betOptionsOnTypes, {
    fields: [odds.typeId, odds.optionId],
    references: [betOptionsOnTypes.typeId, betOptionsOnTypes.optionId],
  }),
  typeOnEvent: one(betTypesOnEvents, {
    fields: [odds.eventId, odds.typeId],
    references: [betTypesOnEvents.eventId, betTypesOnEvents.typeId],
  }),
}));

export const coupons = sqliteTable("coupon", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: text("type", { enum: ["single", "accumulated"] }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
  amount: integer("amount"),
});

export const couponsRealtions = relations(coupons, ({ one, many }) => ({
  user: one(users, { fields: [coupons.userId], references: [users.id] }),
  bets: many(bets),
}));

export const bets = sqliteTable(
  "bet",
  {
    id: integer("id").primaryKey(),
    couponId: text("coupon_id")
      .notNull()
      .references(() => coupons.id, { onDelete: "cascade" }),
    eventId: text("event_id").notNull(),
    amount: integer("amount"),
    odds: integer("odds").notNull(),
    result: text("result", { enum: ["won", "lost", "pending"] }).notNull(),
    typeId: integer("bet_type_id").notNull(),
    optionId: integer("bet_option_id").notNull(),
  },
  (table) => ({
    optionTypeReference: foreignKey({
      columns: [table.typeId, table.optionId],
      foreignColumns: [betOptionsOnTypes.typeId, betOptionsOnTypes.optionId],
    }),
  }),
);

export type Bet = typeof bets.$inferSelect;

export const betsRelations = relations(bets, ({ one }) => ({
  coupon: one(coupons, { fields: [bets.couponId], references: [coupons.id] }),
  event: one(events, { fields: [bets.eventId], references: [events.id] }),
  optionOnType: one(betOptionsOnTypes, {
    fields: [bets.typeId, bets.optionId],
    references: [betOptionsOnTypes.typeId, betOptionsOnTypes.optionId],
  }),
}));
