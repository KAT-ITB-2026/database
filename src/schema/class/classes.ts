import { pgTable, text, integer, boolean, real, timestamp } from "drizzle-orm/pg-core";

export const classes = pgTable("classes", {
  id: text("id").primaryKey().notNull(),
  className: text("class_name").notNull(),
  room: text("room").notNull(),
  quota: integer("quota").notNull(),
  isOpen: boolean("is_open").notNull().default(false),
  lat: real("lat"),
  lng: real("lng"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at"),
});
