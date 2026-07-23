import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const handbookCategories = pgTable("handbook_categories", {
  id: text("id").primaryKey().notNull(),
  name: text("name").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at"),
});
