CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar(50) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" text,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "users_username_key" UNIQUE("username"),
	CONSTRAINT "users_email_key" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"headline" text NOT NULL,
	"employer_name" text NOT NULL,
	"municipality" text,
	"description_text" text,
	"logo_url" text,
	"webpage_url" text,
	"publication_date" timestamp with time zone DEFAULT now(),
	"working_hours_label" text,
	"duration_label" text,
	"status" text DEFAULT 'open',
	"source" text DEFAULT 'local',
	CONSTRAINT "jobs_status_check" CHECK (status = ANY (ARRAY['open'::text, 'closed'::text]))
);