import type { ExtractTablesWithRelations } from "drizzle-orm";
import * as schema from "./schema";

export type Schema = typeof schema;
export type TablesWithRelations = ExtractTablesWithRelations<Schema>;
