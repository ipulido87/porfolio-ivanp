import type { Locale } from "@/config/i18n";
import { siteConfig } from "@/config/site";
import { contact } from "@/content/es/contact";
import type { LeadData } from "@/lib/validations/lead";

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const labelFor = (options: readonly { value: string; label: string }[], value?: string) =>
  options.find((option) => option.value === value)?.label ?? "No indicado";

/** Builds the owner notification, always in Spanish. All lead values are untrusted input. */
export function buildLeadEmail(lead: LeadData, leadId: string, locale: Locale = "es") {
  const { fields, stageOptions, serviceOptions, budgetOptions } = contact.form;
  const rows: [string, string][] = [
    [fields.name.label, lead.name],
    [fields.email.label, lead.email],
    [fields.company.label, lead.company ?? "No indicada"],
    [fields.stage.label, labelFor(stageOptions, lead.stage)],
    [fields.service.label, labelFor(serviceOptions, lead.service)],
    [fields.budget.label, labelFor(budgetOptions, lead.budget)],
    ["Idioma de la web", locale === "en" ? "Inglés" : "Español"],
  ];

  const text = [...rows.map(([label, value]) => `${label}: ${value}`), "", lead.message, "", `Referencia: ${leadId}`].join(
    "\n",
  );

  const html = `<div style="font-family:system-ui,sans-serif;color:#12121c;max-width:600px">
  <h1 style="font-size:20px">Nueva solicitud desde ${escapeHtml(siteConfig.name)}</h1>
  <table style="border-collapse:collapse">${rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:4px 16px 4px 0;color:#5b5b6e">${escapeHtml(label)}</td><td style="padding:4px 0">${escapeHtml(value)}</td></tr>`,
    )
    .join("")}</table>
  <p style="white-space:pre-wrap;margin-top:24px">${escapeHtml(lead.message)}</p>
  <p style="color:#5b5b6e;font-size:12px;margin-top:24px">Referencia: ${escapeHtml(leadId)}</p>
</div>`;

  return { subject: `Nueva solicitud: ${lead.name}`, text, html };
}
