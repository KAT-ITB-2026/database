import { pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { attendanceStatusEnum } from "./schedules";

export const userAttendances = pgTable(
  "user_attendances",
  {
    id: text("id").primaryKey().notNull(),
    scheduleId: text("schedule_id").notNull(),
    userId: text("user_id").notNull(),
    status: attendanceStatusEnum("status").notNull().default("tidak_hadir"),
    notes: text("notes"),
    updatedBy: text("updated_by"),
    updatedAt: timestamp("updated_at"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    scheduleUserUnique: uniqueIndex().on(table.scheduleId, table.userId),
  }),
);
