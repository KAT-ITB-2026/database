import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const media = pgTable("media", {
  id: text("id").primaryKey().notNull(),
  creatorId: text("creator_id"),
  name: text("name").notNull(),
  bucket: text("bucket").notNull(),
  type: text("type").notNull(),
  url: text("url").notNull(),
  updatedAt: timestamp("updated_at"),
  createdAt: timestamp("created_at").defaultNow(),
});
