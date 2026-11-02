import { eq } from "drizzle-orm";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { submitLead, type LeadEmailSender } from "@/features/contact/submit-lead";
import { leads } from "@/lib/db/schema";
import { validRequest } from "@tests/helpers/fixtures";
import { createTestDb } from "@tests/helpers/test-db";

type TestDb = Awaited<ReturnType<typeof createTestDb>>;

describe("submitLead", () => {
  let testDb: TestDb;
  let sendEmail: ReturnType<typeof vi.fn<LeadEmailSender>>;

  const submit = (input: unknown, deps = {}) =>
    submitLead(input, { ipHash: "hash" }, { db: testDb.db, sendEmail, ...deps });
  const allLeads = () => testDb.db.select().from(leads);

  beforeEach(async () => {
    testDb = await createTestDb();
    sendEmail = vi.fn<LeadEmailSender>().mockResolvedValue(undefined);
    vi.spyOn(console, "info").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => testDb.cleanup());

  it("persists a valid lead and marks the email as sent", async () => {
    const result = await submit(validRequest());

    expect(result).toMatchObject({ status: "created", emailDelivered: true });
    const [lead] = await allLeads();
    expect(lead).toMatchObject({
      name: "Ana García",
      email: "ana@empresa.es",
      service: "web",
      budget: "3k-10k",
      stage: "idea",
      locale: "es",
      emailStatus: "sent",
      emailError: null,
      ipHash: "hash",
    });
    expect(lead?.consentAt).toBeInstanceOf(Date);
    expect(sendEmail).toHaveBeenCalledOnce();
  });

  it("stores optional fields as null", async () => {
    await submit(validRequest({ company: "", budget: undefined }));
    const [lead] = await allLeads();
    expect(lead).toMatchObject({ company: null, budget: null });
  });

  it("retains the lead when the email provider fails", async () => {
    sendEmail.mockRejectedValue(Object.assign(new Error("ana@empresa.es bounced"), { code: "provider_down" }));

    const result = await submit(validRequest());

    expect(result).toMatchObject({ status: "created", emailDelivered: false });
    const [lead] = await allLeads();
    expect(lead).toMatchObject({ email: "ana@empresa.es", emailStatus: "failed", emailError: "provider_down" });
  });

  it("does not log personal data when the email fails", async () => {
    const errorLog = vi.spyOn(console, "error").mockImplementation(() => {});
    sendEmail.mockRejectedValue(new Error("ana@empresa.es bounced"));

    await submit(validRequest());

    expect(errorLog).toHaveBeenCalled();
    expect(JSON.stringify(errorLog.mock.calls)).not.toContain("ana@empresa.es");
  });

  it("sends the email only after the lead is stored", async () => {
    let storedWhenSending = 0;
    sendEmail.mockImplementation(async () => {
      storedWhenSending = (await allLeads()).length;
    });

    await submit(validRequest());

    expect(storedWhenSending).toBe(1);
  });

  it("treats a repeated submission id as a duplicate", async () => {
    const request = validRequest();
    await submit(request);
    const second = await submit({ ...request, message: "Otro mensaje distinto con suficiente longitud." });

    expect(second).toEqual({ status: "duplicate" });
    expect(await allLeads()).toHaveLength(1);
    expect(sendEmail).toHaveBeenCalledOnce();
  });

  it("survives concurrent double submits", async () => {
    const request = validRequest();
    const results = await Promise.all([submit(request), submit(request)]);

    expect(results.map((result) => result.status).sort()).toEqual(["created", "duplicate"]);
    expect(await allLeads()).toHaveLength(1);
  });

  it("treats the same message from the same person as a duplicate within 24 hours", async () => {
    await submit(validRequest());
    const second = await submit(validRequest({ email: "ANA@empresa.es" }));

    expect(second).toEqual({ status: "duplicate" });
    expect(await allLeads()).toHaveLength(1);
  });

  it("accepts the same message again after 24 hours", async () => {
    const start = new Date("2026-01-01T10:00:00Z");
    await submit(validRequest(), { now: () => start });
    const later = await submit(validRequest(), { now: () => new Date(start.getTime() + 25 * 3_600_000) });

    expect(later.status).toBe("created");
    expect(await allLeads()).toHaveLength(2);
  });

  it("silently drops honeypot submissions", async () => {
    const result = await submit(validRequest({ website: "https://spam.example" }));

    expect(result).toEqual({ status: "spam" });
    expect(await allLeads()).toHaveLength(0);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("validates on the server independently of the client", async () => {
    const result = await submit(validRequest({ email: "mal", consent: false, message: "corto" }));

    expect(result.status).toBe("invalid");
    if (result.status === "invalid") {
      expect(Object.keys(result.fieldErrors).sort()).toEqual(["consent", "email", "message"]);
    }
    expect(await allLeads()).toHaveLength(0);
  });

  it("propagates database failures instead of reporting success", async () => {
    const original = testDb.db;
    await expect(
      submit(validRequest(), {
        db: new Proxy(original, {
          get: (target, key) => {
            if (key === "insert") throw new Error("database down");
            return Reflect.get(target, key);
          },
        }),
      }),
    ).rejects.toThrow("database down");
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("records the language of the form, so the reply can match it", async () => {
    await submit(validRequest({ locale: "en" }));
    const [lead] = await allLeads();

    expect(lead?.locale).toBe("en");
    expect(sendEmail.mock.calls[0]?.[2]).toBe("en");
  });

  it("answers validation errors in the language of the form", async () => {
    const result = await submit(validRequest({ locale: "en", email: "bad" }));

    expect(result).toMatchObject({ fieldErrors: { email: expect.stringMatching(/valid email/) } });
  });

  it("falls back to Spanish for an unknown language", async () => {
    const result = await submit(validRequest({ locale: "fr", email: "mal" }));

    expect(result.status).toBe("invalid");
    if (result.status === "invalid") expect(result.fieldErrors.email).toMatch(/correo/);
  });

  it("can find failed notifications for later follow-up", async () => {
    sendEmail.mockRejectedValue(new Error("down"));
    await submit(validRequest());

    const failed = await testDb.db.select().from(leads).where(eq(leads.emailStatus, "failed"));
    expect(failed).toHaveLength(1);
  });
});
