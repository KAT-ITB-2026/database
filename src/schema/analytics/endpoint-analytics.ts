import { serial, pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";

export const endpointAnalytics = pgTable("endpoint_analytics", {
  id: serial("id").primaryKey().notNull(),
  accountId: text("account_id"),
  endpoint: text("endpoint").notNull(),
  method: text("method").notNull(),
  statusCode: integer("status_code").notNull(),
  responseTimeMs: integer("response_time_ms"),
  urlQuery: text("url_query"),
  requestBody: text("request_body"),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow(),
});
