"use client";

import { ArrowRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dialog } from "radix-ui";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { otherLocale, type Locale } from "@/config/i18n";
import { getRoutes, switchLocalePath } from "@/config/site";
import type { UiContent } from "@/content";
import { useScrolled } from "@/hooks/use-scrolled";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

// Copy arrives as props so the content modules stay out of the client bundle.
export function SiteHeader({ ui, locale }: { ui: Pick<UiContent, "nav" | "cta" | "common">; locale: Locale }) {
  const pathname = usePathname();
  const routes = getRoutes(locale);
  const targetLocale = otherLocale(locale);
  const languageLink = {
    href: switchLocalePath(pathname, locale, targetLocale),
    hrefLang: targetLocale,
    lang: targetLocale,
    "aria-label": ui.nav.switchLanguage.label,
  };
  const scrolled = useScrolled();
  const [open, setOpen] = useState(false);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 border-b border-transparent transition-[background-color,border-color,backdrop-filter] duration-500",
        scrolled && "border-line bg-ink/80 backdrop-blur-lg",
      )}
    >
      <div className="container-site flex h-[4.5rem] items-center justify-between gap-6">
        <Logo href={routes.home} label={ui.common.logoLabel} />

        <nav aria-label={ui.nav.label} className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {ui.nav.links.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative inline-flex min-h-11 items-center px-4 text-[0.9375rem] text-muted transition-colors hover:text-text",
                      "after:absolute after:inset-x-4 after:bottom-2 after:h-px after:origin-left after:scale-x-0 after:bg-cyan after:transition-transform after:duration-300 hover:after:scale-x-100",
                      active && "text-text after:scale-x-100",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            {...languageLink}
            data-testid="language-switch"
            className="label-mono inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-text transition-colors hover:text-cyan"
          >
            {ui.nav.switchLanguage.short}
          </Link>
          <Button asChild className="hidden sm:inline-flex">
            <Link href={routes.contact}>{ui.cta.primary}</Link>
          </Button>

          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger
              aria-label={ui.nav.open}
              className="-mr-2 inline-flex size-11 items-center justify-center rounded-full text-text lg:hidden"
            >
              <Menu className="size-6" aria-hidden />
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/70 backdrop-blur-sm" />
              <Dialog.Content
                aria-describedby={undefined}
                className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-line bg-ink-2 px-6 pb-8 animate-float-in"
              >
                <div className="flex h-[4.5rem] shrink-0 items-center justify-between">
                  <Dialog.Title className="label-mono">{ui.nav.label}</Dialog.Title>
                  <Dialog.Close
                    aria-label={ui.nav.close}
                    className="-mr-2 inline-flex size-11 items-center justify-center rounded-full text-text"
                  >
                    <X className="size-6" aria-hidden />
                  </Dialog.Close>
                </div>

                <nav aria-label={ui.nav.mobileLabel} className="mt-6 flex-1 overflow-y-auto">
                  <ul>
                    {ui.nav.links.map((link, index) => (
                      <li key={link.href} className="border-b border-line">
                        <Link
                          href={link.href}
                          onClick={() => setOpen(false)}
                          aria-current={isActive(pathname, link.href) ? "page" : undefined}
                          className="flex min-h-16 items-center justify-between font-display text-3xl tracking-tight aria-[current=page]:text-cyan"
                        >
                          {link.label}
                          <span className="label-mono" aria-hidden>
                            0{index + 1}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>

                <Button asChild size="lg" className="mt-8 w-full">
                  <Link href={routes.contact} onClick={() => setOpen(false)}>
                    {ui.cta.primary}
                    <ArrowRight aria-hidden />
                  </Link>
                </Button>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </header>
  );
}
