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
  // Companion-side attendance window (internal_oskm-2026's home_activities
  // .attendance_window_start_at/end_at) — a maba may only be allowed to mark
  // present for part of the activity. Nullable here to match Companion's own
  // column nullability; required at the API layer (event.type.ts), not the
  // DB layer.
  attendanceWindowStartAt: timestamp("attendance_window_start_at", {
    withTimezone: true,
  }),
  attendanceWindowEndAt: timestamp("attendance_window_end_at", {
    withTimezone: true,
  }),
  location: text("location"),
  lat: real("lat"),
  lng: real("lng"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at"),
});
