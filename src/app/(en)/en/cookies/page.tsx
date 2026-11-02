import { LegalPage, legalMetadata } from "@/components/pages/legal-page";

export const metadata = legalMetadata("en", "cookiesPolicy");

export default function Page() {
  return <LegalPage locale="en" document="cookiesPolicy" />;
}
