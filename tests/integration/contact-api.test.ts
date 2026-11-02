import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { handleLeadRequest } from "@/features/contact/handle-lead-request";
import type { LeadEmailSender } from "@/features/contact/submit-lead";
import { leads, rateLimits } from "@/lib/db/schema";
import { consumeRateLimit } from "@/lib/security/rate-limit";
import { validRequest } from "@tests/helpers/fixtures";
import { createTestDb } from "@tests/helpers/test-db";

type TestDb = Awaited<ReturnType<typeof createTestDb>>;

const IP = "203.0.113.7";

const post = (body: unknown, headers: Record<string, string> = {}) =>
  new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json", host: "localhost", "x-forwarded-for": IP, ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });

describe("POST /api/contact", () => {
  let testDb: TestDb;
  let sendEmail: ReturnType<typeof vi.fn<LeadEmailSender>>;

  const call = (request: Request, max = 5) =>
    handleLeadRequest(request, () => ({
      db: testDb.db,
      sendEmail,
      ipSecret: "test-secret",
      rateLimit: { max, windowMs: 60_000 },
    }));

  beforeEach(async () => {
    testDb = await createTestDb();
    sendEmail = vi.fn<LeadEmailSender>().mockResolvedValue(undefined);
    vi.spyOn(console, "info").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => testDb.cleanup());

  it("creates a lead and stores only a hash of the IP", async () => {
    const response = await call(post(validRequest()));

    expect(response?.status).toBe(201);
    expect(await response?.json()).toEqual({ ok: true });
    const [lead] = await testDb.db.select().from(leads);
    expect(lead?.ipHash).toMatch(/^[0-9a-f]{32}$/);
    expect(JSON.stringify(lead)).not.toContain(IP);
  });

  it("still answers 201 when the email fails, because the lead is safe", async () => {
    sendEmail.mockRejectedValue(new Error("provider down"));

    const response = await call(post(validRequest()));

    expect(response?.status).toBe(201);
    expect(await testDb.db.select().from(leads)).toHaveLength(1);
  });

  it("returns Spanish field errors for invalid input", async () => {
    const response = await call(post(validRequest({ email: "mal" })));
    const body = await response?.json();

    expect(response?.status).toBe(400);
    expect(body.error).toBe("invalid");
    expect(body.fieldErrors.email).toMatch(/correo electrónico válido/);
  });

  it("answers bots with a normal success", async () => {
    const response = await call(post(validRequest({ website: "spam" })));

    expect(response?.status).toBe(200);
    expect(await response?.json()).toEqual({ ok: true });
    expect(await testDb.db.select().from(leads)).toHaveLength(0);
  });

  it("rejects malformed JSON", async () => {
    expect((await call(post("{nope")))?.status).toBe(400);
  });

  it("rejects oversized bodies before parsing them", async () => {
    const response = await call(post(validRequest({ message: "x".repeat(20_000) })));
    expect(response?.status).toBe(413);
  });

  it("rejects cross-site requests", async () => {
    const response = await call(post(validRequest(), { origin: "https://evil.example" }));
    expect(response?.status).toBe(403);
    expect(await testDb.db.select().from(leads)).toHaveLength(0);
  });

  it("accepts same-origin browser requests", async () => {
    const response = await call(post(validRequest(), { origin: "http://localhost" }));
    expect(response?.status).toBe(201);
  });

  it("rate limits by IP and reports when to retry", async () => {
    await call(post(validRequest({ message: "Primer mensaje con la longitud necesaria." })), 2);
    await call(post(validRequest({ message: "Segundo mensaje con la longitud necesaria." })), 2);
    const blocked = await call(post(validRequest({ message: "Tercer mensaje con la longitud necesaria." })), 2);

    expect(blocked?.status).toBe(429);
    expect(Number(blocked?.headers.get("Retry-After"))).toBeGreaterThan(0);
    expect(await testDb.db.select().from(leads)).toHaveLength(2);
  });

  it("keeps separate limits per IP", async () => {
    await call(post(validRequest({ message: "Mensaje de la primera persona, suficientemente largo." })), 1);
    const other = await call(
      post(validRequest({ message: "Mensaje de la segunda persona, suficientemente largo." }), {
        "x-forwarded-for": "203.0.113.99",
      }),
      1,
    );

    expect(other?.status).toBe(201);
  });

  it("answers 503 without leaking details when the database fails", async () => {
    const response = await handleLeadRequest(post(validRequest()), () => {
      throw new Error("libsql://secret-host unreachable");
    });

    expect(response?.status).toBe(503);
    expect(await response?.text()).not.toContain("secret-host");
  });
});

describe("consumeRateLimit", () => {
  let testDb: TestDb;
  const policy = { max: 2, windowMs: 1000 };

  beforeEach(async () => {
    testDb = await createTestDb();
  });
  afterEach(() => testDb.cleanup());

  it("allows up to the maximum, then blocks", async () => {
    const results = [];
    for (let i = 0; i < 3; i++) results.push(await consumeRateLimit(testDb.db, "k", policy, 5000));
    expect(results.map((result) => result.allowed)).toEqual([true, true, false]);
  });

  it("opens a new window once the previous one expires", async () => {
    for (let i = 0; i < 3; i++) await consumeRateLimit(testDb.db, "k", policy, 5000);
    const next = await consumeRateLimit(testDb.db, "k", policy, 6001);

    expect(next.allowed).toBe(true);
    const [row] = await testDb.db.select().from(rateLimits);
    expect(row?.count).toBe(1);
  });

  it("counts concurrent hits atomically", async () => {
    const results = await Promise.all(
      Array.from({ length: 5 }, () => consumeRateLimit(testDb.db, "k", policy, 5000)),
    );
    expect(results.filter((result) => result.allowed)).toHaveLength(2);
  });
});
