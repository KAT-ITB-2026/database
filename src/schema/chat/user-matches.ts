import { pgTable, text, boolean, timestamp } from "drizzle-orm/pg-core";

export const userMatches = pgTable("user_matches", {
  id: text("id").primaryKey().notNull(),
  topic: text("topic").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  isAnonymous: boolean("is_anonymous").notNull().default(true),
  isRevealed: boolean("is_revealed").notNull().default(false),
  firstUserId: text("first_user_id").notNull(),
  secondUserId: text("second_user_id").notNull(),
  lastMessage: text("last_message"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
