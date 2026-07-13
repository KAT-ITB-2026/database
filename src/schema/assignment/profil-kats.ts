import { pgTable, text, integer, real } from "drizzle-orm/pg-core";

export const profilKats = pgTable("profil_kats", {
  id: text("id").primaryKey().notNull(),
  profilNumber: integer("profil_number").notNull().unique(),
  assignmentWeight: real("assignment_weight").notNull().default(0),
  attendanceWeight: real("attendance_weight").notNull().default(0),
  title: text("title").notNull(),
  description: text("description"),
});
