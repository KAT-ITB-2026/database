import { sql } from "drizzle-orm";
import { check, integer, pgTable, real, text } from "drizzle-orm/pg-core";

export const profilKats = pgTable(
  "profil_kats",
  {
    id: text("id").primaryKey().notNull(),
    profilNumber: integer("profil_number").notNull().unique(),
    assignmentWeight: real("assignment_weight").notNull().default(0),
    attendanceWeight: real("attendance_weight").notNull().default(0),
    title: text("title").notNull(),
    description: text("description"),
  },
  (table) => ({
    profilNumberRange: check(
      "profil_kats_profil_number_range_check",
      sql`${table.profilNumber} BETWEEN 1 AND 5`,
    ),
  }),
);
