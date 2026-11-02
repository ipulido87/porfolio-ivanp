import Link from "next/link";
import type { Locale } from "@/config/i18n";
import { getRoutes, siteConfig } from "@/config/site";
import { getContent } from "@/content";
import { LinkedInLink } from "./linkedin-link";
import { Logo } from "./logo";

export function SiteFooter({ locale }: { locale: Locale }) {
  const { ui, services } = getContent(locale);
  const routes = getRoutes(locale);

  return (
    <footer className="border-t border-line bg-ink-2/40">
      <div className="container-site grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo href={routes.home} label={ui.common.logoLabel} />
          <p className="mt-5 max-w-sm text-muted">{ui.footer.tagline}</p>
          <p className="label-mono mt-6">
            {siteConfig.location.label} · {siteConfig.location.coords}
          </p>
        </div>

        <nav aria-label={ui.footer.servicesLabel} className="md:col-span-4">
          <h2 className="label-mono tracking-[0.08em]">{ui.footer.servicesLabel}</h2>
          <ul className="mt-4 space-y-1">
            {services.items.map((service) => (
              <li key={service.slug}>
                <Link
                  href={`${routes.services}#${service.slug}`}
                  className="inline-flex min-h-8 items-center text-[0.9375rem] text-muted transition-colors hover:text-text"
                >
                  {service.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label={ui.footer.siteLabel} className="md:col-span-3">
          <h2 className="label-mono tracking-[0.08em]">{ui.footer.siteLabel}</h2>
          <ul className="mt-4 space-y-1">
            {ui.nav.links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex min-h-8 items-center text-[0.9375rem] text-muted transition-colors hover:text-text"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <LinkedInLink
                locale={locale}
                className="inline-flex min-h-8 items-center gap-2 text-[0.9375rem] text-muted transition-colors hover:text-text"
              />
            </li>
            {siteConfig.contactEmail ? (
              <li>
                <a
                  href={`mailto:${siteConfig.contactEmail}`}
                  className="inline-flex min-h-8 items-center text-[0.9375rem] text-muted transition-colors hover:text-text"
                >
                  {siteConfig.contactEmail}
                </a>
              </li>
            ) : null}
          </ul>
        </nav>
      </div>

      <div className="border-t border-line">
        <div className="container-site flex flex-col gap-3 py-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-1">
            {ui.footer.legal.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="inline-flex min-h-8 items-center transition-colors hover:text-text">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
