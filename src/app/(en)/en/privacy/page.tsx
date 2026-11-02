import { LegalPage, legalMetadata } from "@/components/pages/legal-page";

export const metadata = legalMetadata("en", "privacyPolicy");

export default function Page() {
  return <LegalPage locale="en" document="privacyPolicy" />;
}
