import { pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { submissionTypeEnum } from "./submissions";

export const submissionParts = pgTable(
  "submission_parts",
  {
    id: text("id").primaryKey().notNull(),
    submissionId: text("submission_id").notNull(),
    partType: submissionTypeEnum("part_type").notNull(),
    mediaId: text("media_id"),
    content: text("content"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at"),
  },
  (table) => ({
    submissionPartUnique: uniqueIndex().on(table.submissionId, table.partType),
  }),
);
