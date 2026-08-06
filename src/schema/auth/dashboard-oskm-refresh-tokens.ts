import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const dashboardOskmRefreshTokens = pgTable(
  "dashboard_oskm_refresh_tokens",
  {
    jti: text("jti").primaryKey().notNull(),
    accountId: text("account_id").notNull(),
    sessionStartedAt: timestamp("session_started_at").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    revokedAt: timestamp("revoked_at"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    accountIdIdx: index().on(table.accountId),
    expiresAtIdx: index().on(table.expiresAt),
  }),
);
