import type { ReactNode } from "react";
import { rootMetadata, SiteShell, siteViewport } from "@/components/layout/site-shell";

export const metadata = rootMetadata("en");
export const viewport = siteViewport;

export default function RootLayout({ children }: { children: ReactNode }) {
  return <SiteShell locale="en">{children}</SiteShell>;
}
