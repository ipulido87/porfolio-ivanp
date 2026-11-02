import { LegalPage, legalMetadata } from "@/components/pages/legal-page";

export const metadata = legalMetadata("es", "legalNotice");

export default function Page() {
  return <LegalPage locale="es" document="legalNotice" />;
}
