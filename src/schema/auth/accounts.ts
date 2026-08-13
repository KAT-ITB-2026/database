import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const accountsRoleEnum = pgEnum("accounts_role_enum", [
  "admin",
  "mamet",
  "mentor",
  "user",
  "hr",
]);

export const accounts = pgTable("accounts", {
  id: text("id").primaryKey().notNull(),
  nim: text("nim").notNull().unique(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  fullName: text("full_name"),
  role: accountsRoleEnum("role").notNull().default("user"),
  lastLoggedIn: timestamp("last_logged_in"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at"),
});
