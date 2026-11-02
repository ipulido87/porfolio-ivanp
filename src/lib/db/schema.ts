import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const EMAIL_STATUSES = ["pending", "sent", "failed"] as const;
export type EmailStatus = (typeof EMAIL_STATUSES)[number];

export const leads = sqliteTable(
  "leads",
  {
    id: text("id").primaryKey(),
    submissionId: text("submission_id").notNull(),
    fingerprint: text("fingerprint").notNull(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    company: text("company"),
    service: text("service").notNull(),
    budget: text("budget"),
    locale: text("locale").notNull().default("es"),
    stage: text("stage"),
    message: text("message").notNull(),
    consentAt: integer("consent_at", { mode: "timestamp_ms" }).notNull(),
    ipHash: text("ip_hash"),
    emailStatus: text("email_status", { enum: EMAIL_STATUSES }).notNull().default("pending"),
    emailError: text("email_error"),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
  },
  (table) => [
    uniqueIndex("leads_submission_id_unique").on(table.submissionId),
    index("leads_fingerprint_created_idx").on(table.fingerprint, table.createdAt),
    index("leads_email_status_idx").on(table.emailStatus),
  ],
);

export const rateLimits = sqliteTable(
  "rate_limits",
  {
    key: text("key").primaryKey(),
    count: integer("count").notNull(),
    windowStart: integer("window_start", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [index("rate_limits_window_idx").on(table.windowStart)],
);

export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;
