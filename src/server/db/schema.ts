import { relations, sql } from "drizzle-orm";
import {
  bigint,
  char,
  index,
  int,
  mysqlEnum,
  mysqlTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";
import { type AdapterAccount } from "next-auth/adapters";

export const users = mysqlTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
    fsp: 3,
  }).default(sql`CURRENT_TIMESTAMP(3)`),
  image: varchar("image", { length: 255 }),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}));

export const accounts = mysqlTable(
  "account",
  {
    userId: varchar("userId", { length: 255 }).notNull(),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: int("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
    userIdIdx: index("userId_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = mysqlTable(
  "session",
  {
    sessionToken: varchar("sessionToken", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("userId", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("userId_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = mysqlTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier, vt.token),
  }),
);

export const whitelist = mysqlTable("whitelist", {
  email: varchar("email", { length: 255 }).notNull().primaryKey(),
});

export const admins = mysqlTable("admins", {
  userId: varchar("user_id", { length: 255 }).notNull().primaryKey(),
});

export const categories = mysqlTable(
  "category",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
  },
  (table) => ({
    uniqueSlugIndex: uniqueIndex("unique_slug_index").on(table.slug),
  }),
);

export const betTypes = mysqlTable("bet_type", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
});

export const betTypesRelations = relations(betTypes, ({ many }) => ({
  optionsOnTypes: many(betOptionsOnTypes),
}));

export const betOptions = mysqlTable("bet_option", {
  id: serial("id").primaryKey(),
  value: varchar("value", { length: 255 }).notNull(),
});

export const betOptionsRelations = relations(betOptions, ({ many }) => ({
  optionsOnTypes: many(betOptionsOnTypes),
}));

export const betOptionsOnTypes = mysqlTable(
  "bet_option_on_type",
  {
    typeId: bigint("bet_type_id", { mode: "number" }).notNull(),
    optionId: bigint("bet_option_id", { mode: "number" }).notNull(),
  },
  (table) => ({
    compoundKey: primaryKey(table.typeId, table.optionId),
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

export const events = mysqlTable("event", {
  id: char("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  time: timestamp("time", { mode: "date" }).notNull(),
  categoryId: bigint("category_id", { mode: "number" }).notNull(),
  status: mysqlEnum("status", ["upcoming", "live", "finished", "cancelled"])
    .notNull()
    .default("upcoming"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
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

export const betTypesOnEvents = mysqlTable(
  "bet_type_on_event",
  {
    eventId: char("event_id", { length: 36 }).notNull(),
    typeId: bigint("bet_type_id", { mode: "number" }).notNull(),
  },
  (table) => ({
    compoundKey: primaryKey(table.eventId, table.typeId),
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

export const odds = mysqlTable(
  "odds",
  {
    eventId: char("event_id", { length: 36 }).notNull(),
    typeId: bigint("bet_type_id", { mode: "number" }).notNull(),
    optionId: bigint("bet_option_id", { mode: "number" }).notNull(),
    value: int("value").notNull(),
  },
  (table) => ({
    compoundKey: primaryKey(table.eventId, table.typeId, table.optionId),
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
