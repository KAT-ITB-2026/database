import { pgTable, text, real, timestamp } from "drizzle-orm/pg-core";

export const assignmentRubrics = pgTable("assignment_rubrics", {
  id: text("id").primaryKey().notNull(),
  assignmentId: text("assignment_id").notNull(),
  criteria: text("criteria").notNull(),
  weight: real("weight").notNull(),
  minScore: real("min_score").notNull().default(0),
  maxScore: real("max_score").notNull().default(100),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at"),
});
