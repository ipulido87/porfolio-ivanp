CREATE TABLE `leads` (
	`id` text PRIMARY KEY NOT NULL,
	`submission_id` text NOT NULL,
	`fingerprint` text NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`company` text,
	`service` text NOT NULL,
	`budget` text,
	`message` text NOT NULL,
	`consent_at` integer NOT NULL,
	`ip_hash` text,
	`email_status` text DEFAULT 'pending' NOT NULL,
	`email_error` text,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `leads_submission_id_unique` ON `leads` (`submission_id`);--> statement-breakpoint
CREATE INDEX `leads_fingerprint_created_idx` ON `leads` (`fingerprint`,`created_at`);--> statement-breakpoint
CREATE INDEX `leads_email_status_idx` ON `leads` (`email_status`);--> statement-breakpoint
CREATE TABLE `rate_limits` (
	`key` text PRIMARY KEY NOT NULL,
	`count` integer NOT NULL,
	`window_start` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `rate_limits_window_idx` ON `rate_limits` (`window_start`);