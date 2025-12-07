import { pgTable, serial, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { authUsers } from "drizzle-orm/supabase";

export const pushSubscriptionsTable = pgTable("push_subscriptions_table", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id")
    .references(() => authUsers.id, { onDelete: "cascade" })
    .notNull(),
  endpoint: text("endpoint").notNull(),
  p256dh: text("p256dh").notNull(),
  authKey: text("auth_key").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type InsertPushSubscription = typeof pushSubscriptionsTable.$inferInsert;
export type SelectPushSubscription = typeof pushSubscriptionsTable.$inferSelect;
