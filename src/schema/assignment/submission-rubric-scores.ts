import { pgTable, text, real, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export const submissionRubricScores = pgTable(
  "submission_rubric_scores",
  {
    id: text("id").primaryKey().notNull(),
    submissionId: text("submission_id").notNull(),
    rubricId: text("rubric_id").notNull(),
    score: real("score").notNull(),
    feedback: text("feedback"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at"),
  },
  (table) => ({
    submissionRubricUnique: uniqueIndex().on(table.submissionId, table.rubricId),
  }),
);
