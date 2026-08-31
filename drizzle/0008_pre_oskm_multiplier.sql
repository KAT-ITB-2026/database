-- Custom SQL migration file, put your code below! --

-- Pre-OSKM early-points multiplier (D-058, information-oskm-2026) — a
-- WIB-calendar-day decay bonus for early participation, already live on
-- Information's own leaderboard for both Kembara Kampus and Merawat Minat.
-- Mirrors apps/api/internal/modules/leaderboard/multiplier.go's
-- PreOSKMScoreMultiplier exactly (same threshold table, same clamp order).
--
-- Merawat Minat ONLY here — deliberately not Kembara Kampus. Each Merawat
-- task is its own submission with an accurate per-task submitted_at, so
-- applying the multiplier fresh at read time (never persisted, matching the
-- Go side's own "source score tables remain unchanged" principle) is
-- correct. Kembara Kampus can't use this approach: all 17 of a student's
-- rubric scores share ONE submissions row (one row per assignment+user), so
-- that row's single submitted_at ends up being whichever scan was pushed
-- last — a read-time multiplier keyed off it would apply one day's rate to
-- a student's entire multi-day sweep instead of each scan's own rate.
-- Kembara Kampus's multiplier is instead baked into each
-- submission_rubric_scores.score directly at push time, per scan, using
-- that scan's own real timestamp before it gets lost to the shared-row
-- collapse — see pushKembaraKampusScan in
-- information-oskm-2026/apps/api/cmd/backfill-dashboard-sync/main.go. That
-- score already carries its own bonus, so applying this function to it too
-- would double-multiply it.
--
-- TIMEZONE: submitted_at is a TIMESTAMP WITHOUT TIME ZONE column whose naive
-- wall-clock digits already represent WIB local time directly (empirically
-- verified 2026-08-31 by comparing a real pushed Merawat submission's naive
-- value in this DB against the same row's tz-aware source value in
-- Information's own DB) — so submitted_at::date already gives the correct
-- WIB calendar day, no AT TIME ZONE conversion needed.
CREATE OR REPLACE FUNCTION pre_oskm_multiplier(submitted_at timestamp, assignment_type text)
RETURNS double precision
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT CASE
    WHEN submitted_at IS NULL OR assignment_type != 'sidequest_minat'
      THEN 1.0::double precision
    ELSE LEAST(1.35, GREATEST(1.00,
      ROUND((1.35 - (submitted_at::date - DATE '2026-08-12') * 0.05)::numeric, 2)
    ))::double precision
  END
$$;
--> statement-breakpoint

DROP MATERIALIZED VIEW "public"."recap_snapshot";
--> statement-breakpoint
CREATE MATERIALIZED VIEW "public"."recap_snapshot" AS (
  WITH submission_scores AS (
    SELECT
      srs.submission_id,
      SUM((srs.score / NULLIF(ar.max_score, 0)) * ar.weight)
        * MAX(a.max_score)
        * MAX(pre_oskm_multiplier(s.submitted_at, a.type)) AS raw_score
    FROM submission_rubric_scores srs
    JOIN assignment_rubrics ar ON ar.id = srs.rubric_id
    JOIN submissions s ON s.id = srs.submission_id
    JOIN assignments a ON a.id = s.assignment_id
    WHERE ar.max_score > 0
    GROUP BY srs.submission_id
  ),
  credited_submissions AS (
    SELECT
      s.user_id AS target_user_id,
      s.id AS submission_id,
      s.assignment_id,
      p.profil_number,
      s.submitted_at,
      ss.raw_score
    FROM submissions s
    JOIN assignments a ON a.id = s.assignment_id AND a.assignee = 'Solo'
    JOIN profil_kats p ON p.id = a.profil_kat_id
    JOIN submission_scores ss ON ss.submission_id = s.id
    WHERE s.is_flagged = false

    UNION ALL

    SELECT
      tu.id AS target_user_id,
      s.id AS submission_id,
      s.assignment_id,
      p.profil_number,
      s.submitted_at,
      ss.raw_score
    FROM submissions s
    JOIN users su ON su.id = s.user_id
    JOIN assignments a ON a.id = s.assignment_id AND a.assignee = 'Keluarga'
    JOIN profil_kats p ON p.id = a.profil_kat_id
    JOIN submission_scores ss ON ss.submission_id = s.id
    JOIN users tu ON su.keluarga_id IS NOT NULL AND tu.keluarga_id = su.keluarga_id
    WHERE s.is_flagged = false
  ),
  best_submission AS (
    SELECT DISTINCT ON (target_user_id, assignment_id)
      target_user_id, assignment_id, profil_number, raw_score
    FROM credited_submissions
    ORDER BY target_user_id, assignment_id, submitted_at DESC NULLS LAST, submission_id DESC
  ),
  profile_scores AS (
    SELECT
      target_user_id,
      profil_number,
      ROUND(SUM(raw_score)::numeric, 2)::double precision AS profile_score
    FROM best_submission
    GROUP BY target_user_id, profil_number
  ),
  score_rollup AS (
    SELECT
      target_user_id,
      COALESCE(MAX(profile_score) FILTER (WHERE profil_number = 1), 0)::double precision AS profil_1,
      COALESCE(MAX(profile_score) FILTER (WHERE profil_number = 2), 0)::double precision AS profil_2,
      COALESCE(MAX(profile_score) FILTER (WHERE profil_number = 3), 0)::double precision AS profil_3,
      COALESCE(MAX(profile_score) FILTER (WHERE profil_number = 4), 0)::double precision AS profil_4,
      COALESCE(MAX(profile_score) FILTER (WHERE profil_number = 5), 0)::double precision AS profil_5,
      ROUND(SUM(profile_score)::numeric, 2)::double precision AS total_score
    FROM profile_scores
    GROUP BY target_user_id
  ),
  attendance_stats AS (
    SELECT
      ua.user_id,
      COUNT(*) FILTER (WHERE ua.status = 'hadir') AS hadir
    FROM user_attendances ua
    JOIN attendance_schedules asch ON asch.id = ua.schedule_id
    WHERE asch.start_time <= now()
    GROUP BY ua.user_id
  ),
  eligible_schedules AS (
    SELECT COUNT(*) AS total
    FROM attendance_schedules
    WHERE start_time <= now()
  )
  SELECT
    u.id AS user_id,
    acc.nim,
    acc.full_name AS nama,
    u.keluarga_id,
    k.name AS keluarga,
    b.name AS bata,
    u.fakultas,
    COALESCE(sr.profil_1, 0)::double precision AS profil_1,
    COALESCE(sr.profil_2, 0)::double precision AS profil_2,
    COALESCE(sr.profil_3, 0)::double precision AS profil_3,
    COALESCE(sr.profil_4, 0)::double precision AS profil_4,
    COALESCE(sr.profil_5, 0)::double precision AS profil_5,
    COALESCE(sr.total_score, 0)::double precision AS total_score,
    CASE WHEN es.total > 0
      THEN ROUND((COALESCE(att.hadir, 0)::numeric / es.total) * 100, 2)::double precision
      ELSE 0::double precision
    END AS presence_percentage,
    now() AS refreshed_at
  FROM users u
  JOIN accounts acc ON acc.id = u.id
  LEFT JOIN keluargas k ON k.id = u.keluarga_id
  LEFT JOIN batas b ON b.id = u.bata_id
  LEFT JOIN score_rollup sr ON sr.target_user_id = u.id
  LEFT JOIN attendance_stats att ON att.user_id = u.id
  CROSS JOIN eligible_schedules es
);
--> statement-breakpoint
-- DROP MATERIALIZED VIEW cascades to its indexes, so the unique index
-- REFRESH MATERIALIZED VIEW CONCURRENTLY requires (dashboard-recap-refresh
-- cron) must be recreated here too — same reason 0005/0007 both do this.
CREATE UNIQUE INDEX "recap_snapshot_user_id_index" ON "public"."recap_snapshot" USING btree ("user_id");
