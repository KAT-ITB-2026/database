import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const handbookAccessEnum = pgEnum("handbook_access_enum", ["mentor", "mentor_maba"]);
export const handbookCategoryEnum = pgEnum("handbook_category_enum", [
  "ToR",
  "Buku Besar",
  "Handbook",
]);

export const handbook = pgTable("handbook", {
  id: text("id").primaryKey().notNull(),
  title: text("title").notNull(),
  mediaId: text("media_id").notNull(),
  category: handbookCategoryEnum("category").notNull().default("Handbook"),
  access: handbookAccessEnum("access").notNull().default("mentor"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at"),
});
