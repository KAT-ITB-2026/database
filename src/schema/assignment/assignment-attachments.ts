import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const assignmentAttachments = pgTable("assignment_attachments", {
  id: text("id").primaryKey().notNull(),
  assignmentId: text("assignment_id").notNull(),
  label: text("label"),
  url: text("url").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
