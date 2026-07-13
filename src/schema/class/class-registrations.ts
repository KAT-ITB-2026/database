import { pgTable, text, boolean, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export const classRegistrations = pgTable(
  "class_registrations",
  {
    id: text("id").primaryKey().notNull(),
    userId: text("user_id").notNull(),
    classId: text("class_id").notNull(),
    isAutoAssigned: boolean("is_auto_assigned").notNull().default(false),
    registeredAt: timestamp("registered_at").defaultNow(),
  },
  (table) => ({
    userUnique: uniqueIndex().on(table.userId),
  }),
);
