import type { ReactNode } from "react";
import { rootMetadata, SiteShell, siteViewport } from "@/components/layout/site-shell";

export const metadata = rootMetadata("es");
export const viewport = siteViewport;

export default function RootLayout({ children }: { children: ReactNode }) {
  return <SiteShell locale="es">{children}</SiteShell>;
}
