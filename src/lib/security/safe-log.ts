type LogFields = Record<string, string | number | boolean | undefined>;

// Fields that may hold personal data never reach the logs, even by accident.
const BLOCKED_FIELDS = new Set(["name", "email", "company", "message", "ip", "phone", "body", "headers"]);

/** Reduces an unknown error to something safe: its class, never its message. */
export function errorCode(error: unknown) {
  if (error && typeof error === "object") {
    const { code, name } = error as { code?: unknown; name?: unknown };
    if (typeof code === "string" && code) return code.slice(0, 60);
    if (typeof name === "string" && name) return name.slice(0, 60);
  }
  return "unknown_error";
}

export function sanitizeFields(fields: LogFields): LogFields {
  return Object.fromEntries(Object.entries(fields).filter(([key]) => !BLOCKED_FIELDS.has(key.toLowerCase())));
}

export function safeLog(level: "info" | "warn" | "error", event: string, fields: LogFields = {}) {
  console[level](JSON.stringify({ level, event, ...sanitizeFields(fields) }));
}
