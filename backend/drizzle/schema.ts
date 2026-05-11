import { pgTable, unique, uuid, varchar, text, timestamp, check } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const users = pgTable("users", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	username: varchar({ length: 50 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	passwordHash: text("password_hash"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	unique("users_username_key").on(table.username),
	unique("users_email_key").on(table.email),
]);

export const jobs = pgTable("jobs", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	headline: text().notNull(),
	employerName: text("employer_name").notNull(),
	municipality: text(),
	descriptionText: text("description_text"),
	logoUrl: text("logo_url"),
	webpageUrl: text("webpage_url"),
	publicationDate: timestamp("publication_date", { withTimezone: true, mode: 'string' }).defaultNow(),
	workingHoursLabel: text("working_hours_label"),
	durationLabel: text("duration_label"),
	status: text().default('open'),
	source: text().default('local'),
}, (table) => [
	check("jobs_status_check", sql`status = ANY (ARRAY['open'::text, 'closed'::text])`),
]);
