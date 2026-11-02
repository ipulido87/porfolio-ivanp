import "server-only";

import { createClient } from "@libsql/client";
import { drizzle, type LibSQLDatabase } from "drizzle-orm/libsql";
import { resolveDatabaseConfig } from "./config";
import * as schema from "./schema";

export type Database = LibSQLDatabase<typeof schema>;

let database: Database | undefined;

/** Created on first use so that `next build` works without database secrets. */
export function getDb(): Database {
  if (!database) {
    database = drizzle(createClient(resolveDatabaseConfig(process.env)), { schema });
  }
  return database;
}
