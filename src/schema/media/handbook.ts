import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const handbook = pgTable("handbook", {
  id: text("id").primaryKey().notNull(),
  title: text("title").notNull(),
  mediaId: text("media_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at"),
});
