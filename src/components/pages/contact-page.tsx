import { JsonLd } from "@/components/layout/json-ld";
import { LinkedInLink } from "@/components/layout/linkedin-link";
import { PageHero } from "@/components/layout/page-hero";
import { WhatsAppButton } from "@/components/layout/whatsapp";
import { Reveal } from "@/components/motion/reveal";
import type { Locale } from "@/config/i18n";
import { getRoutes, siteConfig } from "@/config/site";
import { getContent } from "@/content";
import { ContactForm } from "@/features/contact/contact-form";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { SERVICE_VALUES, type ServiceValue } from "@/lib/validations/lead";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export type ContactSearchParams = Promise<{ servicio?: string | string[] }>;

export function contactMetadata(locale: Locale) {
  return buildMetadata({ ...getContent(locale).pages.contact.seo, route: "contact", locale });
}

type ContactPageProps = { locale: Locale; searchParams: ContactSearchParams };

export async function ContactPage({ locale, searchParams }: ContactPageProps) {
  const { servicio } = await searchParams;
  const { contact, ui } = getContent(locale);
  const initialService = SERVICE_VALUES.find((value): value is ServiceValue => value === servicio);
  const { aside } = contact;

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(locale, contact.eyebrow, getRoutes(locale).contact)} />
      <PageHero compact eyebrow={contact.eyebrow} title={contact.headline} description={contact.description} />

      <div className="container-site grid gap-12 pb-28 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <ContactForm
            copy={contact.form}
            validation={contact.validation}
            locale={locale}
            initialService={initialService}
          />
        </div>

        <Reveal delay={0.2} className="lg:col-span-4">
          <aside className="space-y-10 lg:sticky lg:top-28">
            <div>
              <h2 className="text-2xl">{aside.title}</h2>
              <ol className="mt-5 space-y-4">
                {aside.steps.map((step, index) => (
                  <li key={step} className="flex gap-4 text-muted">
                    <span aria-hidden className="label-mono pt-1 text-cyan">
                      0{index + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            {buildWhatsAppUrl(ui.cta.whatsappMessage) ? (
              <div className="border-t border-line pt-8">
                <h2 className="text-2xl">{aside.whatsappTitle}</h2>
                <p className="mt-3 text-muted">{aside.whatsappBody}</p>
                <WhatsAppButton locale={locale} size="md" className="mt-5" />
              </div>
            ) : null}

            {siteConfig.contactEmail ? (
              <p className="text-muted">
                {aside.emailLabel}{" "}
                <a
                  href={`mailto:${siteConfig.contactEmail}`}
                  className="text-text underline underline-offset-3 hover:text-cyan"
                >
                  {siteConfig.contactEmail}
                </a>
              </p>
            ) : null}

            <LinkedInLink
              locale={locale}
              className="inline-flex min-h-11 items-center gap-2 text-muted transition-colors hover:text-cyan"
            />
          </aside>
        </Reveal>
      </div>
    </>
  );
}
