import type { Project } from "@/features/projects/types";
import type { projects as es } from "../es/projects";

// Keep the same order as the Spanish file: the homepage shows the first four.
const items: Project[] = [
  {
    slug: "parchebici",
    name: "ParcheBici",
    kind: "personal",
    category: "Marketplace · Colombia",
    summary:
      "A marketplace for used bikes and parts in Colombia with protected payment: funds are held until the buyer confirms delivery.",
    scope: ["Peer-to-peer buying and selling", "Protected payment with Mercado Pago", "Price calculator", "Stolen bike register", "Shop directory"],
    stack: ["React", "TypeScript", "Express", "Prisma", "PostgreSQL", "Mercado Pago"],
    visual: "marketplace",
    image: { src: "/projects/parchebici.jpg", alt: "ParcheBici home page" },
    url: "https://www.parchebici.com.co",
  },
  {
    slug: "rodamallorca",
    name: "RodaMallorca",
    kind: "personal",
    category: "Marketplace · Mallorca",
    summary: "A cycling marketplace that connects riders with workshops in Mallorca to buy, rent and repair bikes.",
    scope: ["Workshops and services", "Bikes and parts for sale", "Bike rental", "Routes on an interactive map", "Natural language search"],
    stack: ["React", "TypeScript", "Express", "Prisma", "PostgreSQL", "Stripe"],
    visual: "routes",
    image: { src: "/projects/rodamallorca.jpg", alt: "RodaMallorca home page" },
    url: "https://www.rodamallorca.es",
  },
  {
    slug: "mallorca-beach-and-beyond",
    name: "Mallorca Beach & Beyond",
    kind: "live",
    category: "Online booking · Mallorca",
    summary:
      "A paddleboard hire website for Cala Sant Vicenç and Port de Pollença, with online booking in Spanish, English and German.",
    scope: ["Online booking", "Board catalogue", "Customer reviews", "Three-language website", "Admin panel"],
    stack: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Tailwind CSS", "next-intl"],
    visual: "calendar",
    image: { src: "/projects/mallorca-beach-and-beyond.jpg", alt: "Mallorca Beach & Beyond home page" },
    url: "https://www.mallorcabeachandbeyond.com/en",
  },
  {
    slug: "api-and-e2e-test-automation",
    name: "Autonomous E2E testing agent",
    kind: "personal",
    category: "Software quality · In-house tool",
    summary:
      "A command-line tool that takes a user flow described in plain language and a URL, explores the real site with Playwright and generates a TypeScript test project using BDD and the Page Object Model.",
    scope: [
      "Explores the real site through Playwright MCP",
      "Gherkin scenarios from the described flow",
      "TypeScript Page Objects",
      "New project or added to an existing one",
      "Local templates when no AI is available",
    ],
    stack: ["Python", "Pydantic AI", "Playwright MCP", "TypeScript", "playwright-bdd", "Cucumber.js"],
    visual: "pipeline",
  },
  {
    slug: "booking-and-appointments",
    name: "Booking and appointment management",
    kind: "concept",
    category: "Business application",
    summary: "An example application for organising appointments, availability and customers for a service business.",
    scope: ["Calendar and availability", "Online booking", "Management dashboard", "Automatic reminders"],
    stack: ["Next.js", "TypeScript", "PostgreSQL"],
    visual: "calendar",
  },
];

export const projects: typeof es = {
  items,
  kindLabels: {
    personal: "Personal project",
    live: "Live project",
    concept: "Concept",
  },
  labels: {
    scope: "Scope",
    stack: "Technologies",
    placeholder: "Illustrative image",
    visit: "Visit",
  },
};
