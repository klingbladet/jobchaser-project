ALTER TABLE "saved_jobs" DROP CONSTRAINT IF EXISTS "saved_jobs_job_id_jobs_id_fk";
--> statement-breakpoint
ALTER TABLE "jobs" ALTER COLUMN "id" SET DATA TYPE text;
--> statement-breakpoint
ALTER TABLE "jobs" ALTER COLUMN "id" DROP DEFAULT;
--> statement-breakpoint
ALTER TABLE "saved_jobs" ALTER COLUMN "job_id" SET DATA TYPE text;
--> statement-breakpoint
ALTER TABLE "saved_jobs" ADD CONSTRAINT "saved_jobs_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;