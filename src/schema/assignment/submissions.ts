import { pgEnum, pgTable, text, boolean, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export const submissionTypeEnum = pgEnum("submission_type_enum", [
  "file",
  "text",
  "link",
]);

export const submissions = pgTable(
  "submissions",
  {
    id: text("id").primaryKey().notNull(),
    assignmentId: text("assignment_id").notNull(),
    userId: text("user_id").notNull(),
    submissionType: submissionTypeEnum("submission_type").notNull(),
    mediaId: text("media_id"),
    content: text("content"),
    isFlagged: boolean("is_flagged").notNull().default(false),
    flaggedReason: text("flagged_reason"),
    submittedAt: timestamp("submitted_at").defaultNow(),
    gradedBy: text("graded_by"),
    gradedAt: timestamp("graded_at"),
    updatedAt: timestamp("updated_at"),
  },
  (table) => ({
    assignmentUserUnique: uniqueIndex().on(table.assignmentId, table.userId),
  }),
);
