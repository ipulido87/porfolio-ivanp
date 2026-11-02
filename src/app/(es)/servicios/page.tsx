import { ServicesPage, servicesMetadata } from "@/components/pages/services-page";

export const metadata = servicesMetadata("es");

export default function Page() {
  return <ServicesPage locale="es" />;
}
