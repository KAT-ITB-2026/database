import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const batas = pgTable("batas", {
  id: text("id").primaryKey().notNull(),
  name: text("name").notNull(),
  groupLink: text("group_link"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at"),
});
