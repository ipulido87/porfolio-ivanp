import { ContactPage, contactMetadata, type ContactSearchParams } from "@/components/pages/contact-page";

export const metadata = contactMetadata("en");

export default function Page({ searchParams }: { searchParams: ContactSearchParams }) {
  return <ContactPage locale="en" searchParams={searchParams} />;
}
