// Creates a clean database for the E2E run from the committed migrations.
import { mkdirSync, rmSync } from "node:fs";
import path from "node:path";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";

const url = process.env.TURSO_DATABASE_URL;
if (!url?.startsWith("file:")) throw new Error("E2E runs require a file database");

const file = url.slice("file:".length);
mkdirSync(path.dirname(file), { recursive: true });
for (const suffix of ["", "-shm", "-wal", "-info"]) rmSync(file + suffix, { force: true });

const client = createClient({ url });
await migrate(drizzle(client), { migrationsFolder: "drizzle" });
client.close();
