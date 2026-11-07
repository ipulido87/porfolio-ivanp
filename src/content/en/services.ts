import type { Service } from "@/features/services/types";
import type { services as es } from "../es/services";

const items: Service[] = [
  {
    slug: "custom-websites-and-applications",
    value: "web",
    title: "Custom websites and applications",
    summary: "Mid-scale web products, specified before they are built and developed with AI under engineering judgement.",
    description:
      "I build complete websites and applications: frontend, backend, data and deployment. First we agree in writing what the product must do; AI speeds up development and tests confirm that it does what was agreed.",
    visual: "web",
    includes: [
      "A written specification before development",
      "Management dashboards and internal tools",
      "Booking systems and marketplaces",
      "End-to-end development with React, Next.js, Node.js and PostgreSQL",
    ],
    idealFor: "Companies and entrepreneurs who need something an off-the-shelf product can't deliver.",
  },
  {
    slug: "ai-automation",
    value: "ai",
    title: "AI automation",
    summary: "Work that is done by hand today, handled with AI, integrations and the controls that make the result reliable.",
    description:
      "I look at how your team works and automate what doesn't need a person. I combine AI models, integrations and deterministic rules, using AI only where it adds value, so the process stays reliable and its cost reasonable.",
    visual: "flow",
    includes: [
      "Workflows with AI agents",
      "API integrations with your tools",
      "Internal assistants connected to your data",
      "Cloud or local models, depending on how sensitive the data is",
    ],
    idealFor: "Teams that spend too much time on repetitive tasks.",
  },
  {
    slug: "quality-for-ai-built-software",
    value: "qa",
    title: "Quality for AI-built software",
    summary: "Automated tests and audits that tell you your software works, whether a person or an AI wrote it.",
    description:
      "This is my specialty. I define a quality strategy based on business risk and implement tests built into your delivery process. I also audit AI-generated applications and fix what's needed to take them to production safely. To move faster, I use an in-house agent that explores your site and generates a first version of the tests, which I review before integrating them.",
    visual: "tests",
    includes: [
      "Test strategy based on business risk",
      "E2E and API testing with Playwright and RestAssured",
      "In-house agent that generates E2E tests from a described flow",
      "Audit and rescue of AI-built applications",
    ],
    idealFor: "Growing products where every release feels like a risk.",
  },
];

export const services: typeof es = {
  items,
  art: {
    tests: ["user sign-up", "checkout flow", "orders API", "performance"],
  },
};
