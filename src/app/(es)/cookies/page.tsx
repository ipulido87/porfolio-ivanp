import { LegalPage, legalMetadata } from "@/components/pages/legal-page";

export const metadata = legalMetadata("es", "cookiesPolicy");

export default function Page() {
  return <LegalPage locale="es" document="cookiesPolicy" />;
}
