import { doublePrecision, pgView, text } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

/**
 * Live keluarga aggregation over the individual materialized snapshot.
 */
export const keluargaLeaderboard = pgView("keluarga_leaderboard", {
  keluargaId: text("keluarga_id").notNull(),
  keluarga: text("keluarga"),
  finalScore: doublePrecision("final_score").notNull(),
}).as(sql`
  SELECT
    keluarga_id,
    keluarga,
    SUM(total_score)::double precision AS final_score
  FROM individual_leaderboard
  WHERE keluarga_id IS NOT NULL
  GROUP BY keluarga_id, keluarga
`);
