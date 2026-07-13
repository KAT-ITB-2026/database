import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const keluargas = pgTable("keluargas", {
  id: text("id").primaryKey().notNull(),
  bataId: text("bata_id").notNull(),
  name: text("name").notNull(),
  groupLink: text("group_link"),
  mentorName: text("mentor_name"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at"),
});
