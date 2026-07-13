import { pgEnum, pgTable, text, timestamp, integer, boolean } from "drizzle-orm/pg-core";

export const assignmentTypeEnum = pgEnum("assignment_type_enum", [
  "wajib",
  "sidequest_jelajah",
  "sidequest_minat",
  "sidequest_lainnya",
]);

export const assignments = pgTable("assignments", {
  id: text("id").primaryKey().notNull(),
  profilKatId: text("profil_kat_id"),
  type: assignmentTypeEnum("type").notNull().default("wajib"),
  tagId: text("tag_id"),
  day: integer("day"),
  title: text("title").notNull(),
  description: text("description"),
  startDate: timestamp("start_date", { withTimezone: true }).notNull(),
  endDate: timestamp("end_date", { withTimezone: true }).notNull(),
  isOpen: boolean("is_open").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at"),
});
