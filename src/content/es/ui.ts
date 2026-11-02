import { getRoutes } from "@/config/site";
import type { NavLink } from "@/types/content";

const routes = getRoutes("es");

export const ui = {
  nav: {
    label: "Navegación principal",
    mobileLabel: "Navegación móvil",
    open: "Abrir menú",
    close: "Cerrar menú",
    switchLanguage: { short: "EN", label: "Read this page in English" },
    links: [
      { href: routes.services, label: "Servicios" },
      { href: routes.projects, label: "Proyectos" },
      { href: routes.about, label: "Sobre mí" },
      { href: routes.contact, label: "Contacto" },
    ] satisfies NavLink[],
  },
  cta: {
    primary: "Cuéntame tu proyecto",
    secondary: "Explorar servicios",
    whatsapp: "Escríbeme por WhatsApp",
    whatsappFloating: "Hablemos por WhatsApp",
    whatsappMessage: "Hola, he visto tu web y me gustaría hablar sobre un proyecto tecnológico.",
  },
  common: {
    home: "Inicio",
    logoLabel: "Pulido Labs, ir al inicio",
    skipToContent: "Saltar al contenido",
    opensInNewTab: "se abre en una pestaña nueva",
  },
  footer: {
    tagline: "Software a medida, automatización y calidad para empresas que necesitan que la tecnología funcione.",
    servicesLabel: "Servicios",
    siteLabel: "Sitio",
    legal: [
      { href: routes.legal, label: "Aviso legal" },
      { href: routes.privacy, label: "Privacidad" },
      { href: routes.cookies, label: "Cookies" },
    ] satisfies NavLink[],
  },
  notFound: {
    eyebrow: "Error 404",
    title: "Esta página no existe.",
    description: "Puede que el enlace haya cambiado o que la dirección no sea correcta.",
    action: "Volver al inicio",
  },
  error: {
    eyebrow: "Algo ha fallado",
    title: "No hemos podido cargar esta página.",
    description: "Ha ocurrido un error inesperado. Prueba de nuevo dentro de un momento.",
    action: "Reintentar",
  },
};
