import { getClientIp, hashIp } from "@/lib/security/hash";
import { consumeRateLimit, type RateLimitPolicy } from "@/lib/security/rate-limit";
import { errorCode, safeLog } from "@/lib/security/safe-log";
import { submitLead, type SubmitLeadDeps } from "./submit-lead";

const MAX_BODY_BYTES = 16 * 1024;

export type ContactApiResponse =
  | { ok: true }
  | { ok: false; error: "invalid"; fieldErrors: Record<string, string> }
  | { ok: false; error: "rate_limited"; retryAfterSeconds: number }
  | { ok: false; error: "bad_request" | "forbidden" | "too_large" | "server" };

type HandlerDeps = SubmitLeadDeps & { ipSecret: string; rateLimit: RateLimitPolicy };

const json = (body: ContactApiResponse, status: number, headers?: HeadersInit) =>
  Response.json(body, { status, headers });

/** Browsers always send Origin on POST: a foreign one means a cross-site request. */
function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === (request.headers.get("x-forwarded-host") ?? request.headers.get("host"));
  } catch {
    return false;
  }
}

export async function handleLeadRequest(request: Request, resolveDeps: () => HandlerDeps) {
  if (!isSameOrigin(request)) return json({ ok: false, error: "forbidden" }, 403);

  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_BODY_BYTES) return json({ ok: false, error: "too_large" }, 413);

  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return json({ ok: false, error: "bad_request" }, 400);
  }
  if (raw.length > MAX_BODY_BYTES) return json({ ok: false, error: "too_large" }, 413);

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ ok: false, error: "bad_request" }, 400);
  }

  try {
    const deps = resolveDeps();
    const ipHash = hashIp(getClientIp(request.headers), deps.ipSecret);

    const limit = await consumeRateLimit(deps.db, `contact:${ipHash}`, deps.rateLimit);
    if (!limit.allowed) {
      safeLog("warn", "lead.rate_limited");
      return json({ ok: false, error: "rate_limited", retryAfterSeconds: limit.retryAfterSeconds }, 429, {
        "Retry-After": String(limit.retryAfterSeconds),
      });
    }

    const result = await submitLead(body, { ipHash }, deps);
    switch (result.status) {
      case "invalid":
        return json({ ok: false, error: "invalid", fieldErrors: result.fieldErrors }, 400);
      case "created":
        return json({ ok: true }, 201);
      // Spam and duplicates look like a normal success on purpose.
      case "duplicate":
      case "spam":
        return json({ ok: true }, 200);
    }
  } catch (error) {
    safeLog("error", "lead.request_failed", { code: errorCode(error) });
    return json({ ok: false, error: "server" }, 503);
  }
}
