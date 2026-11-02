type DatabaseEnv = Record<string, string | undefined>;

/**
 * Leads must never land on an ephemeral disk, so file databases need an
 * explicit opt-in that exists only for local development and E2E runs.
 */
export function resolveDatabaseConfig(env: DatabaseEnv) {
  const url = env.TURSO_DATABASE_URL;
  if (!url) throw new Error("TURSO_DATABASE_URL is not configured");

  const isLocalFile = url.startsWith("file:") || url === ":memory:";
  if (isLocalFile && env.ALLOW_LOCAL_DB !== "1") {
    throw new Error("Local file databases are disabled: set a remote Turso URL");
  }
  return { url, authToken: env.TURSO_AUTH_TOKEN || undefined };
}
