import {
  pgTable, text, timestamp, boolean, integer,
  pgEnum, index, uniqueIndex,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

// ─── Enums ──────────────────────────────────────────────────────────────────
export const planEnum   = pgEnum("plan",   ["free", "pro", "agency"]);
export const alertType  = pgEnum("alert_type", ["price", "feature", "content", "new_page", "removed_page", "cta"]);
export const alertStatus = pgEnum("alert_status", ["unread", "read"]);
export const jobStatus  = pgEnum("job_status", ["pending", "running", "done", "failed"]);

// ─── Users ──────────────────────────────────────────────────────────────────
// Better Auth manages the user/session/account tables itself.
// We extend the user with our own fields via a separate profile table.
export const userProfiles = pgTable("user_profiles", {
  id:               text("id").primaryKey().$defaultFn(() => createId()),
  userId:           text("user_id").notNull().unique(),     // FK → Better Auth user
  plan:             planEnum("plan").notNull().default("free"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubId:      text("stripe_sub_id"),
  trialEndsAt:      timestamp("trial_ends_at"),
  createdAt:        timestamp("created_at").notNull().defaultNow(),
  updatedAt:        timestamp("updated_at").notNull().defaultNow(),
}, (t) => ([
  index("user_profiles_user_id_idx").on(t.userId),
]));

// ─── Competitors ─────────────────────────────────────────────────────────────
export const competitors = pgTable("competitors", {
  id:          text("id").primaryKey().$defaultFn(() => createId()),
  userId:      text("user_id").notNull(),
  name:        text("name").notNull(),
  url:         text("url").notNull(),
  description: text("description"),
  active:      boolean("active").notNull().default(true),
  lastChecked: timestamp("last_checked"),
  createdAt:   timestamp("created_at").notNull().defaultNow(),
  updatedAt:   timestamp("updated_at").notNull().defaultNow(),
}, (t) => ([
  index("competitors_user_id_idx").on(t.userId),
]));

// ─── Snapshots ───────────────────────────────────────────────────────────────
export const snapshots = pgTable("snapshots", {
  id:           text("id").primaryKey().$defaultFn(() => createId()),
  competitorId: text("competitor_id").notNull(),
  contentHash:  text("content_hash").notNull(),
  rawText:      text("raw_text").notNull(),
  createdAt:    timestamp("created_at").notNull().defaultNow(),
}, (t) => ([
  index("snapshots_competitor_id_idx").on(t.competitorId),
]));

// ─── Alerts ──────────────────────────────────────────────────────────────────
export const alerts = pgTable("alerts", {
  id:           text("id").primaryKey().$defaultFn(() => createId()),
  userId:       text("user_id").notNull(),
  competitorId: text("competitor_id").notNull(),
  type:         alertType("type").notNull().default("content"),
  status:       alertStatus("status").notNull().default("unread"),
  title:        text("title").notNull(),
  summary:      text("summary"),                          // AI-generated
  diffPreview:  text("diff_preview"),                     // raw diff snippet
  createdAt:    timestamp("created_at").notNull().defaultNow(),
}, (t) => ([
  index("alerts_user_id_idx").on(t.userId),
  index("alerts_competitor_id_idx").on(t.competitorId),
]));

// ─── Scan Jobs ───────────────────────────────────────────────────────────────
export const scanJobs = pgTable("scan_jobs", {
  id:           text("id").primaryKey().$defaultFn(() => createId()),
  competitorId: text("competitor_id").notNull(),
  status:       jobStatus("status").notNull().default("pending"),
  triggeredBy:  text("triggered_by").default("cron"),     // "cron" | "manual"
  error:        text("error"),
  startedAt:    timestamp("started_at"),
  finishedAt:   timestamp("finished_at"),
  createdAt:    timestamp("created_at").notNull().defaultNow(),
}, (t) => ([
  index("scan_jobs_competitor_id_idx").on(t.competitorId),
]));

// ─── Type exports ─────────────────────────────────────────────────────────────
export type UserProfile = typeof userProfiles.$inferSelect;
export type Competitor  = typeof competitors.$inferSelect;
export type Snapshot    = typeof snapshots.$inferSelect;
export type Alert       = typeof alerts.$inferSelect;
export type ScanJob     = typeof scanJobs.$inferSelect;
