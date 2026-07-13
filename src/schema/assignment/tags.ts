import { pgTable, text } from "drizzle-orm/pg-core";

export const tags = pgTable("tags", {
  id: text("id").primaryKey().notNull(),
  name: text("name").notNull().unique(),
});
