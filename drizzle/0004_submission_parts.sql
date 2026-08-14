CREATE TABLE "submission_parts" (
	"id" text PRIMARY KEY NOT NULL,
	"submission_id" text NOT NULL,
	"part_type" "submission_type_enum" NOT NULL,
	"media_id" text,
	"content" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "password_hash" text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "submission_parts_submission_id_part_type_index" ON "submission_parts" USING btree ("submission_id","part_type");
--> statement-breakpoint
INSERT INTO "submission_parts" ("id", "submission_id", "part_type", "media_id", "content", "created_at")
SELECT
	"id" || '-part',
	"id",
	"submission_type",
	"media_id",
	"content",
	COALESCE("submitted_at", now())
FROM "submissions";
