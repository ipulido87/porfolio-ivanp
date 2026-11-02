import type { Service } from "@/features/services/types";
import type { services as es } from "../es/services";

const items: Service[] = [
  {
    slug: "custom-web-development",
    value: "web",
    title: "Custom web development",
    summary: "Platforms, dashboards, booking systems and marketplaces built around the way you work, not the other way round.",
    description:
      "I build web applications tailored to your business, from an internal tool to a platform for your customers. We start with what adds the most value and grow from there.",
    visual: "web",
    includes: ["Management dashboards and internal tools", "Booking and appointment systems", "Marketplaces and customer portals", "Corporate websites with custom functionality"],
    idealFor: "Companies and entrepreneurs who need something an off-the-shelf product can't deliver.",
  },
  {
    slug: "full-stack-development",
    value: "fullstack",
    title: "Full stack development",
    summary: "Frontend, backend, data and deployment under one technical lead.",
    description:
      "I take care of the whole product, or join your project to strengthen whatever it needs. I work mainly with TypeScript, React, Next.js, Node.js and PostgreSQL.",
    visual: "stack",
    includes: ["Interfaces with React and Next.js", "REST APIs with Node.js, Express or NestJS", "Data modelling with PostgreSQL and Prisma", "Deployment with Docker and GitHub Actions"],
    idealFor: "Startups building their product and teams that need extra technical capacity.",
  },
  {
    slug: "process-automation",
    value: "automation",
    title: "Process automation",
    summary: "Connect your tools and eliminate the repetitive work that is still done by hand.",
    description:
      "I look at how information moves through your company and automate the steps that don't need a person: third-party integrations, data syncing, alerts and reports.",
    visual: "flow",
    includes: ["API integrations between applications", "Data synchronisation between systems", "Automated workflows and alerts", "Automatic report generation"],
    idealFor: "Teams that spend too much time on repetitive admin tasks.",
  },
  {
    slug: "qa-and-test-automation",
    value: "qa",
    title: "QA and test automation",
    summary: "Catch bugs before your customers do, with tests that run on every change.",
    description:
      "This is my specialty. I define a quality strategy suited to your product and implement automated API, end-to-end and performance tests, built into your delivery process.",
    visual: "tests",
    includes: ["Test strategy and quality audits", "E2E testing with Playwright or Selenium", "API testing with RestAssured", "Load testing with k6 and continuous integration"],
    idealFor: "Growing products where every release feels like a risk.",
  },
  {
    slug: "technology-consulting",
    value: "consulting",
    title: "Technology consulting",
    summary: "A clear technical opinion before you invest, so you can decide with confidence.",
    description:
      "I help you make technical decisions with no conflict of interest: what to build, what to buy, which architecture to choose, or how to assess the real state of a project already under way.",
    visual: "compass",
    includes: ["Technical reviews of existing projects", "Scope definition and roadmap", "Architecture and technology selection", "Support for teams and suppliers"],
    idealFor: "Anyone facing an important technology decision who wants a second opinion.",
  },
  {
    slug: "software-maintenance-and-evolution",
    value: "maintenance",
    title: "Software maintenance and evolution",
    summary: "Your application kept up to date, stable and ready to keep growing.",
    description:
      "Software needs care after launch. I take on fixing bugs, updating dependencies, improving what exists and adding features without putting what already works at risk.",
    visual: "history",
    includes: ["Bug fixing and continuous improvement", "Dependency and security updates", "Refactoring and technical debt reduction", "New features on existing code"],
    idealFor: "Companies with an application in production, whether or not I built it.",
  },
];

export const services: typeof es = {
  items,
  art: {
    layers: ["Interface", "API", "Data"],
    tests: ["user sign-up", "checkout flow", "orders API", "performance"],
  },
};
