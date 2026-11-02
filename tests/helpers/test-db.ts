import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import * as schema from "@/lib/db/schema";

/** A real libSQL database on a temp file, built from the committed migrations. */
export async function createTestDb() {
  const dir = mkdtempSync(path.join(tmpdir(), "pulido-labs-"));
  const client = createClient({ url: `file:${path.join(dir, "test.db").replaceAll("\\", "/")}` });
  const db = drizzle(client, { schema });
  await migrate(db, { migrationsFolder: "drizzle" });

  return {
    db,
    cleanup: () => {
      client.close();
      // Windows keeps the native handle briefly after close(): the OS temp
      // folder is a fine place to leave the odd file behind.
      try {
        rmSync(dir, { recursive: true, force: true });
      } catch {}
    },
  };
}
