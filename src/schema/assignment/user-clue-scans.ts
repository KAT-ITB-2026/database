import { pgTable, text, real, boolean, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export const userClueScans = pgTable(
  "user_clue_scans",
  {
    id: text("id").primaryKey().notNull(),
    clueId: text("clue_id").notNull(),
    userId: text("user_id").notNull(),
    scannedLat: real("scanned_lat"),
    scannedLng: real("scanned_lng"),
    isValid: boolean("is_valid").notNull().default(true),
    scannedAt: timestamp("scanned_at").defaultNow(),
  },
  (table) => ({
    clueUserUnique: uniqueIndex().on(table.clueId, table.userId),
  }),
);
