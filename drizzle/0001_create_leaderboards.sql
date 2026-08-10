ALTER TABLE "profil_kats" ADD CONSTRAINT "profil_kats_profil_number_range_check" CHECK ("profil_kats"."profil_number" BETWEEN 1 AND 5);--> statement-breakpoint
CREATE MATERIALIZED VIEW "public"."individual_leaderboard" AS (
  WITH submission_scores AS (
    SELECT
      srs.submission_id,
      SUM((srs.score / NULLIF(ar.max_score, 0)) * ar.weight) * 100 AS raw_score
    FROM submission_rubric_scores srs
    JOIN assignment_rubrics ar ON ar.id = srs.rubric_id
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
    END AS presence_percentage
  FROM users u
  JOIN accounts acc ON acc.id = u.id
  LEFT JOIN keluargas k ON k.id = u.keluarga_id
  LEFT JOIN batas b ON b.id = u.bata_id
  LEFT JOIN score_rollup sr ON sr.target_user_id = u.id
  LEFT JOIN attendance_stats att ON att.user_id = u.id
  CROSS JOIN eligible_schedules es
);--> statement-breakpoint
CREATE UNIQUE INDEX "individual_leaderboard_user_id_index" ON "individual_leaderboard" USING btree ("user_id");--> statement-breakpoint
CREATE VIEW "public"."keluarga_leaderboard" AS (
  SELECT
    keluarga_id,
    keluarga,
    SUM(total_score)::double precision AS final_score
  FROM individual_leaderboard
  WHERE keluarga_id IS NOT NULL
  GROUP BY keluarga_id, keluarga
);
