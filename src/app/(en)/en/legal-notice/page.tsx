import { LegalPage, legalMetadata } from "@/components/pages/legal-page";

export const metadata = legalMetadata("en", "legalNotice");

export default function Page() {
  return <LegalPage locale="en" document="legalNotice" />;
}
