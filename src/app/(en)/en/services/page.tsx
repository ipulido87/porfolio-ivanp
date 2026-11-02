import { ServicesPage, servicesMetadata } from "@/components/pages/services-page";

export const metadata = servicesMetadata("en");

export default function Page() {
  return <ServicesPage locale="en" />;
}
