import { pgTable, text, integer, real, timestamp } from "drizzle-orm/pg-core";

export const assignmentClues = pgTable("assignment_clues", {
  id: text("id").primaryKey().notNull(),
  assignmentId: text("assignment_id").notNull(),
  orderNumber: integer("order_number").notNull(),
  clueText: text("clue_text"),
  clueImageMediaId: text("clue_image_media_id"),
  qrCodeValue: text("qr_code_value").notNull(),
  lat: real("lat").notNull(),
  lng: real("lng").notNull(),
  radiusMeters: real("radius_meters").notNull().default(50),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at"),
});
