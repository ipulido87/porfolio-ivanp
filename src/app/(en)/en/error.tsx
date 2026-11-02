"use client";

import { ErrorView } from "@/components/pages/error-view";
import { ui } from "@/content/en/ui";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return <ErrorView copy={ui.error} reset={reset} />;
}
