import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const contentBlocks = pgTable("content_blocks", {
  id: text("id").primaryKey().notNull(),
  key: text("key").notNull().unique(),
  title: text("title"),
  content: text("content"),
  mediaId: text("media_id"),
  updatedAt: timestamp("updated_at"),
});
