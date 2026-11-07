import type { Project, ProjectKind } from "@/features/projects/types";

const kindLabels: Record<ProjectKind, string> = {
  personal: "Proyecto personal",
  live: "Proyecto en producción",
  concept: "Concepto",
};

// Real projects first: the homepage shows the first four. Describe scope, never
// results. Screenshots live in public/projects.
const items: Project[] = [
  {
    slug: "parchebici",
    name: "ParcheBici",
    kind: "personal",
    category: "Marketplace · Colombia",
    summary:
      "Marketplace de bicicletas y repuestos usados en Colombia, con pago protegido: el dinero queda retenido hasta que el comprador confirma la entrega.",
    scope: [
      "Compraventa entre ciclistas",
      "Pago protegido con Mercado Pago",
      "Calculadora de precio",
      "Registro de bicis robadas",
      "Directorio de tiendas",
    ],
    stack: ["React", "TypeScript", "Express", "Prisma", "PostgreSQL", "Mercado Pago"],
    visual: "marketplace",
    image: { src: "/projects/parchebici.jpg", alt: "Página de inicio de ParcheBici" },
    url: "https://www.parchebici.com.co",
  },
  {
    slug: "rodamallorca",
    name: "RodaMallorca",
    kind: "personal",
    category: "Marketplace · Mallorca",
    summary: "Marketplace de ciclismo que conecta a ciclistas con talleres de Mallorca para comprar, alquilar y reparar bicicletas.",
    scope: [
      "Talleres y servicios",
      "Venta de bicis y recambios",
      "Alquiler de bicicletas",
      "Rutas con mapa interactivo",
      "Búsqueda en lenguaje natural",
    ],
    stack: ["React", "TypeScript", "Express", "Prisma", "PostgreSQL", "Stripe"],
    visual: "routes",
    image: { src: "/projects/rodamallorca.jpg", alt: "Página de inicio de RodaMallorca" },
    url: "https://www.rodamallorca.es",
  },
  {
    slug: "mallorca-beach-and-beyond",
    name: "Mallorca Beach & Beyond",
    kind: "live",
    category: "Reservas online · Mallorca",
    summary:
      "Web de alquiler de tablas de paddle surf en Cala Sant Vicenç y Port de Pollença, con reserva online en español, inglés y alemán.",
    scope: ["Reserva online", "Catálogo de tablas", "Reseñas de clientes", "Web en tres idiomas", "Panel de administración"],
    stack: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Tailwind CSS", "next-intl"],
    visual: "calendar",
    image: { src: "/projects/mallorca-beach-and-beyond.jpg", alt: "Página de inicio de Mallorca Beach & Beyond" },
    url: "https://www.mallorcabeachandbeyond.com/es",
  },
  {
    slug: "automatizacion-de-pruebas",
    name: "Agente autónomo de pruebas E2E",
    kind: "personal",
    category: "Calidad de software · Herramienta propia",
    summary:
      "Herramienta de línea de comandos que recibe un flujo descrito en lenguaje natural y una URL, explora la web real con Playwright y genera un proyecto de pruebas en TypeScript con BDD y Page Object Model.",
    scope: [
      "Exploración de la web real con Playwright MCP",
      "Escenarios Gherkin a partir del flujo descrito",
      "Page Objects en TypeScript",
      "Proyecto nuevo o integrado en uno existente",
      "Plantillas locales cuando no hay IA disponible",
    ],
    stack: ["Python", "Pydantic AI", "Playwright MCP", "TypeScript", "playwright-bdd", "Cucumber.js"],
    visual: "pipeline",
  },
  {
    slug: "gestion-de-reservas",
    name: "Gestión de reservas y citas",
    kind: "concept",
    category: "Aplicación de negocio",
    summary: "Ejemplo de aplicación para organizar citas, disponibilidad y clientes de un negocio de servicios.",
    scope: ["Calendario y disponibilidad", "Reserva en línea", "Panel de gestión", "Avisos automáticos"],
    stack: ["Next.js", "TypeScript", "PostgreSQL"],
    visual: "calendar",
  },
];

export const projects = {
  items,
  kindLabels,
  labels: {
    scope: "Alcance",
    stack: "Tecnologías",
    placeholder: "Imagen ilustrativa",
    visit: "Visitar",
  },
};
