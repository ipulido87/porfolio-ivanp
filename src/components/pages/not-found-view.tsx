import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/config/i18n";
import { getRoutes } from "@/config/site";
import { getContent } from "@/content";

export function NotFoundView({ locale }: { locale: Locale }) {
  const { notFound } = getContent(locale).ui;

  return (
    <section className="container-site flex min-h-svh flex-col items-start justify-center pt-24">
      <p className="label-mono text-cyan">{notFound.eyebrow}</p>
      <h1 className="mt-5 text-[length:var(--text-display)]">{notFound.title}</h1>
      <p className="mt-6 max-w-lg text-lg text-muted">{notFound.description}</p>
      <Button asChild size="lg" className="mt-9">
        <Link href={getRoutes(locale).home}>{notFound.action}</Link>
      </Button>
    </section>
  );
}
