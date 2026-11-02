import { ContactPage, contactMetadata, type ContactSearchParams } from "@/components/pages/contact-page";

export const metadata = contactMetadata("es");

export default function Page({ searchParams }: { searchParams: ContactSearchParams }) {
  return <ContactPage locale="es" searchParams={searchParams} />;
}
