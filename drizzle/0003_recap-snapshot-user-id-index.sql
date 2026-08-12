-- Custom SQL migration file, put your code below! --

-- 0002_loving_greymalkin.sql dropped + recreated recap_snapshot (its SQL body
-- changed to reference assignments.max_score), which also drops the view's
-- dependent indexes. The unique index below was originally added by hand in
-- 0001_mean_obadiah_stane.sql (Drizzle's materialized-view builder has no
-- schema-level way to declare indexes, so drizzle-kit generate can't know to
-- re-emit it) — REFRESH MATERIALIZED VIEW CONCURRENTLY recap_snapshot (used
-- by kat-crons' dashboard-recap-refresh job) requires it and fails without it:
-- "cannot refresh materialized view "public.recap_snapshot" concurrently".
CREATE UNIQUE INDEX "recap_snapshot_user_id_index" ON "public"."recap_snapshot" USING btree ("user_id");