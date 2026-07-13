import { bigserial, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const messages = pgTable("messages", {
  id: bigserial("id", { mode: "bigint" }).primaryKey().notNull(),
  userMatchId: text("user_match_id").notNull(),
  senderId: text("sender_id").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
