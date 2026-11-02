import { afterEach, describe, expect, it, vi } from "vitest";
import { localizedRoutes, routeKeys, switchLocalePath } from "@/config/site";
import { resolveDatabaseConfig } from "@/lib/db/config";
import { buildLeadEmail, escapeHtml } from "@/lib/email/lead-notification";
import { getClientIp, hashIp, leadFingerprint } from "@/lib/security/hash";
import { DEFAULT_RATE_LIMIT, rateLimitFromEnv } from "@/lib/security/rate-limit";
import { errorCode, safeLog, sanitizeFields } from "@/lib/security/safe-log";
import { absoluteUrl, serializeJsonLd } from "@/lib/seo";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { validLead } from "@tests/helpers/fixtures";

describe("buildWhatsAppUrl", () => {
  it("strips formatting and encodes the Spanish message", () => {
    const message = "Hola, he visto tu web y me gustaría hablar sobre un proyecto tecnológico.";
    const url = new URL(buildWhatsAppUrl(message, "+34 600 000 000")!);
    expect(url.origin + url.pathname).toBe("https://wa.me/34600000000");
    expect(url.searchParams.get("text")).toBe(message);
  });

  it("uses the configured Spanish number by default", () => {
    expect(new URL(buildWhatsAppUrl("Hola")!).pathname).toBe("/34634260374");
  });

  it.each(["", "123", "1234567890123456"])("returns null for the invalid number %j", (phone) => {
    expect(buildWhatsAppUrl("Hola", phone)).toBeNull();
  });
});

describe("hashing", () => {
  it("never exposes the IP and depends on the secret", () => {
    const hash = hashIp("203.0.113.7", "secret");
    expect(hash).not.toContain("203.0.113.7");
    expect(hash).not.toBe(hashIp("203.0.113.7", "other-secret"));
  });

  it("gives the same fingerprint despite case and spacing changes", () => {
    expect(leadFingerprint("ANA@x.es", "Hola   mundo\n")).toBe(leadFingerprint("ana@x.es ", "hola mundo"));
    expect(leadFingerprint("ana@x.es", "hola")).not.toBe(leadFingerprint("ana@x.es", "adiós"));
  });

  it("reads the first forwarded hop", () => {
    expect(getClientIp(new Headers({ "x-forwarded-for": "203.0.113.7, 10.0.0.1" }))).toBe("203.0.113.7");
    expect(getClientIp(new Headers({ "x-real-ip": "203.0.113.8" }))).toBe("203.0.113.8");
    expect(getClientIp(new Headers())).toBe("unknown");
  });
});

describe("rateLimitFromEnv", () => {
  it("uses overrides and ignores invalid values", () => {
    expect(rateLimitFromEnv({ RATE_LIMIT_MAX: "9", RATE_LIMIT_WINDOW_SECONDS: "60" })).toEqual({ max: 9, windowMs: 60_000 });
    expect(rateLimitFromEnv({ RATE_LIMIT_MAX: "nope", RATE_LIMIT_WINDOW_SECONDS: "-1" })).toEqual(DEFAULT_RATE_LIMIT);
  });
});

describe("resolveDatabaseConfig", () => {
  it("fails without a URL", () => {
    expect(() => resolveDatabaseConfig({})).toThrow(/TURSO_DATABASE_URL/);
  });

  it("refuses ephemeral file databases unless explicitly allowed", () => {
    expect(() => resolveDatabaseConfig({ TURSO_DATABASE_URL: "file:./local.db" })).toThrow(/disabled/);
    expect(resolveDatabaseConfig({ TURSO_DATABASE_URL: "file:./local.db", ALLOW_LOCAL_DB: "1" }).url).toBe("file:./local.db");
  });

  it("passes remote credentials through", () => {
    expect(resolveDatabaseConfig({ TURSO_DATABASE_URL: "libsql://db.turso.io", TURSO_AUTH_TOKEN: "t" })).toEqual({
      url: "libsql://db.turso.io",
      authToken: "t",
    });
  });
});

describe("safe logging", () => {
  afterEach(() => vi.restoreAllMocks());

  it("drops fields that can hold personal data", () => {
    expect(sanitizeFields({ leadId: "1", email: "a@b.c", Name: "Ana", message: "x" })).toEqual({ leadId: "1" });
  });

  it("logs the error class, never the error message", () => {
    expect(errorCode(Object.assign(new Error("ana@empresa.es rejected"), { code: "E_MAIL" }))).toBe("E_MAIL");
    expect(errorCode(new TypeError("ana@empresa.es rejected"))).toBe("TypeError");
    expect(errorCode("ana@empresa.es")).toBe("unknown_error");
  });

  it("writes structured JSON", () => {
    const spy = vi.spyOn(console, "info").mockImplementation(() => {});
    safeLog("info", "lead.created", { leadId: "1", email: "a@b.c" });
    expect(JSON.parse(spy.mock.calls[0]![0] as string)).toEqual({ level: "info", event: "lead.created", leadId: "1" });
  });
});

describe("lead email", () => {
  it("escapes HTML", () => {
    expect(escapeHtml(`<img src=x onerror="a('b')">&`)).toBe("&lt;img src=x onerror=&quot;a(&#39;b&#39;)&quot;&gt;&amp;");
  });

  it("never injects lead content as markup", () => {
    const { html, text } = buildLeadEmail(
      { ...validLead, budget: undefined, message: "<script>alert(1)</script> mensaje largo" },
      "id-1",
      "en",
    );
    expect(text).toContain("Idioma de la web: Inglés");
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
    expect(text).toContain("No indicado");
    expect(text).toContain("Referencia: id-1");
  });
});

describe("switchLocalePath", () => {
  it("maps every page to its translation, in both directions", () => {
    for (const key of routeKeys) {
      expect(switchLocalePath(localizedRoutes.es[key], "es", "en")).toBe(localizedRoutes.en[key]);
      expect(switchLocalePath(localizedRoutes.en[key], "en", "es")).toBe(localizedRoutes.es[key]);
    }
  });

  it("falls back to the home page for unknown paths", () => {
    expect(switchLocalePath("/no-existe", "es", "en")).toBe("/en");
  });
});

describe("seo helpers", () => {
  it("builds absolute URLs", () => {
    expect(absoluteUrl("/")).not.toMatch(/\/$/);
    expect(absoluteUrl("/servicios")).toMatch(/\/servicios$/);
  });

  it("neutralises script breakouts in JSON-LD", () => {
    const output = serializeJsonLd({ name: "</script><script>alert(1)</script>" });
    expect(output).not.toContain("</script>");
    expect(JSON.parse(output).name).toBe("</script><script>alert(1)</script>");
  });
});
