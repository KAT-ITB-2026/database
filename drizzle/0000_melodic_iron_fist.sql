CREATE TYPE "public"."accounts_role_enum" AS ENUM('admin', 'mamet', 'mentor', 'user', 'hr');--> statement-breakpoint
CREATE TYPE "public"."attendance_status_enum" AS ENUM('hadir', 'tidak_hadir', 'izin');--> statement-breakpoint
CREATE TYPE "public"."assignment_type_enum" AS ENUM('wajib', 'sidequest_jelajah', 'sidequest_minat', 'sidequest_lainnya');--> statement-breakpoint
CREATE TYPE "public"."submission_type_enum" AS ENUM('file', 'text', 'link');--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"nim" text NOT NULL,
	"email" text NOT NULL,
	"full_name" text,
	"role" "accounts_role_enum" DEFAULT 'user' NOT NULL,
	"last_logged_in" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "accounts_nim_unique" UNIQUE("nim"),
	CONSTRAINT "accounts_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"fakultas" text,
	"prodi" text,
	"keluarga_id" text,
	"bata_id" text,
	"foto_media_id" text,
	"tag_id" text,
	"id_line" text,
	"no_hp" text,
	"instagram" text,
	"twitter" text,
	"linkedin" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "batas" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"group_link" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "keluargas" (
	"id" text PRIMARY KEY NOT NULL,
	"bata_id" text NOT NULL,
	"name" text NOT NULL,
	"group_link" text,
	"mentor_name" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "handbook" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"media_id" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "media" (
	"id" text PRIMARY KEY NOT NULL,
	"creator_id" text,
	"name" text NOT NULL,
	"bucket" text NOT NULL,
	"type" text NOT NULL,
	"url" text NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "attendance_schedules" (
	"id" text PRIMARY KEY NOT NULL,
	"day" integer NOT NULL,
	"title" text NOT NULL,
	"start_time" timestamp with time zone NOT NULL,
	"end_time" timestamp with time zone NOT NULL,
	"location" text,
	"lat" real,
	"lng" real,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "user_attendances" (
	"id" text PRIMARY KEY NOT NULL,
	"schedule_id" text NOT NULL,
	"user_id" text NOT NULL,
	"status" "attendance_status_enum" DEFAULT 'tidak_hadir' NOT NULL,
	"notes" text,
	"updated_by" text,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "assignment_attachments" (
	"id" text PRIMARY KEY NOT NULL,
	"assignment_id" text NOT NULL,
	"label" text,
	"url" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "assignment_clues" (
	"id" text PRIMARY KEY NOT NULL,
	"assignment_id" text NOT NULL,
	"order_number" integer NOT NULL,
	"clue_text" text,
	"clue_image_media_id" text,
	"qr_code_value" text NOT NULL,
	"lat" real NOT NULL,
	"lng" real NOT NULL,
	"radius_meters" real DEFAULT 50 NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "assignment_rubrics" (
	"id" text PRIMARY KEY NOT NULL,
	"assignment_id" text NOT NULL,
	"criteria" text NOT NULL,
	"weight" real NOT NULL,
	"min_score" real DEFAULT 0 NOT NULL,
	"max_score" real DEFAULT 100 NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "assignments" (
	"id" text PRIMARY KEY NOT NULL,
	"profil_kat_id" text,
	"type" "assignment_type_enum" DEFAULT 'wajib' NOT NULL,
	"tag_id" text,
	"day" integer,
	"title" text NOT NULL,
	"description" text,
	"start_date" timestamp with time zone NOT NULL,
	"end_date" timestamp with time zone NOT NULL,
	"is_open" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "profil_kats" (
	"id" text PRIMARY KEY NOT NULL,
	"profil_number" integer NOT NULL,
	"assignment_weight" real DEFAULT 0 NOT NULL,
	"attendance_weight" real DEFAULT 0 NOT NULL,
	"title" text NOT NULL,
	"description" text,
	CONSTRAINT "profil_kats_profil_number_unique" UNIQUE("profil_number")
);
--> statement-breakpoint
CREATE TABLE "submission_rubric_scores" (
	"id" text PRIMARY KEY NOT NULL,
	"submission_id" text NOT NULL,
	"rubric_id" text NOT NULL,
	"score" real NOT NULL,
	"feedback" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "submissions" (
	"id" text PRIMARY KEY NOT NULL,
	"assignment_id" text NOT NULL,
	"user_id" text NOT NULL,
	"submission_type" "submission_type_enum" NOT NULL,
	"media_id" text,
	"content" text,
	"is_flagged" boolean DEFAULT false NOT NULL,
	"flagged_reason" text,
	"submitted_at" timestamp DEFAULT now(),
	"graded_by" text,
	"graded_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "tags_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "user_clue_scans" (
	"id" text PRIMARY KEY NOT NULL,
	"clue_id" text NOT NULL,
	"user_id" text NOT NULL,
	"scanned_lat" real,
	"scanned_lng" real,
	"is_valid" boolean DEFAULT true NOT NULL,
	"scanned_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "class_registrations" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"class_id" text NOT NULL,
	"is_auto_assigned" boolean DEFAULT false NOT NULL,
	"registered_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "classes" (
	"id" text PRIMARY KEY NOT NULL,
	"class_name" text NOT NULL,
	"room" text NOT NULL,
	"quota" integer NOT NULL,
	"is_open" boolean DEFAULT false NOT NULL,
	"lat" real,
	"lng" real,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"user_match_id" text NOT NULL,
	"sender_id" text NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_matches" (
	"id" text PRIMARY KEY NOT NULL,
	"topic" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"is_anonymous" boolean DEFAULT true NOT NULL,
	"is_revealed" boolean DEFAULT false NOT NULL,
	"first_user_id" text NOT NULL,
	"second_user_id" text NOT NULL,
	"last_message" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "content_blocks" (
	"id" text PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"title" text,
	"content" text,
	"media_id" text,
	"updated_at" timestamp,
	CONSTRAINT "content_blocks_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "endpoint_analytics" (
	"id" serial PRIMARY KEY NOT NULL,
	"account_id" text,
	"endpoint" text NOT NULL,
	"method" text NOT NULL,
	"status_code" integer NOT NULL,
	"response_time_ms" integer,
	"url_query" text,
	"request_body" text,
	"error_message" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_attendances_schedule_id_user_id_index" ON "user_attendances" USING btree ("schedule_id","user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "submission_rubric_scores_submission_id_rubric_id_index" ON "submission_rubric_scores" USING btree ("submission_id","rubric_id");--> statement-breakpoint
CREATE UNIQUE INDEX "submissions_assignment_id_user_id_index" ON "submissions" USING btree ("assignment_id","user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "user_clue_scans_clue_id_user_id_index" ON "user_clue_scans" USING btree ("clue_id","user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "class_registrations_user_id_index" ON "class_registrations" USING btree ("user_id");