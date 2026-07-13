import { pgEnum, pgTable, text, timestamp, integer, real } from "drizzle-orm/pg-core";

export const attendanceStatusEnum = pgEnum("attendance_status_enum", [
  "hadir",
  "tidak_hadir",
  "izin",
]);

export const attendanceSchedules = pgTable("attendance_schedules", {
  id: text("id").primaryKey().notNull(),
  day: integer("day").notNull(),
  title: text("title").notNull(),
  startTime: timestamp("start_time", { withTimezone: true }).notNull(),
  endTime: timestamp("end_time", { withTimezone: true }).notNull(),
  location: text("location"),
  lat: real("lat"),
  lng: real("lng"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at"),
});
