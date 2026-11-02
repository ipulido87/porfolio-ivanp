import type { about as es } from "../es/about";

export const about: typeof es = {
  eyebrow: "About",
  headline: [{ text: "AI software engineering" }, { text: "with a quality mindset.", accent: true }],
  intro:
    "I'm a QA Automation Engineer and full stack developer, with around eight years of experience in software quality and enterprise projects.",
  story: {
    title: "Two crafts, one obsession: making it work.",
    paragraphs: [
      "Software quality teaches you to look at a system from the side where it fails: where it breaks, what was overlooked and what costs the most to fix once it's in production.",
      "Today I combine that experience with full stack development and AI to help companies build custom software. I don't just build applications: I design them with reliability, testing and long-term maintenance in mind from the start.",
    ],
  },
  aiWorkflow: {
    eyebrow: "How I use AI",
    title: "AI with a method, not blind trust.",
    description: "I apply this approach both in enterprise environments and in my own products.",
    items: [
      {
        title: "The specification leads",
        body: "I design spec-driven workflows where behaviour is defined before development, and AI agents work from that source of truth.",
      },
      {
        title: "A team of specialised agents",
        body: "In my projects, agents with product, architecture, development and QA roles collaborate in a single workflow, each with its own responsibilities.",
      },
      {
        title: "Generated and validated tests",
        body: "I've built flows that generate test cases from user stories, with validators that check their structure and traceability to the acceptance criteria.",
      },
      {
        title: "Autonomous application exploration",
        body: "I develop agents that explore real web applications, generate Gherkin scenarios and produce maintainable Playwright code, using models selectively to keep costs down.",
      },
    ],
  },
  advantages: {
    eyebrow: "What it means for your business",
    title: "Why combining development and quality matters.",
    items: [
      {
        title: "Fewer surprises in production",
        body: "Common failures are considered during design, rather than discovered once they're affecting your customers.",
      },
      {
        title: "Change with confidence",
        body: "With automated tests on critical flows, adding features doesn't mean crossing your fingers at every release.",
      },
      {
        title: "More predictable costs",
        body: "Maintainable, well-tested code helps keep each future improvement from costing more than the last.",
      },
      {
        title: "A single point of contact",
        body: "The person who designs, builds and tests is the same one, so no information gets lost between teams.",
      },
    ],
  },
  stack: {
    eyebrow: "Technologies",
    title: "The tools I work with.",
    groups: [
      { label: "Languages and frontend", items: ["Java", "TypeScript", "React", "Next.js"] },
      { label: "Backend and data", items: ["Node.js", "Express", "NestJS", "PostgreSQL", "Prisma", "REST APIs"] },
      { label: "AI and agents", items: ["Python", "OpenAI", "Gemini", "Ollama", "Playwright MCP", "GitHub Copilot", "OpenSpec", "Claude Code"] },
      { label: "Quality and testing", items: ["Playwright", "Selenium", "RestAssured", "Cucumber", "k6", "Stryker", "SonarQube"] },
      { label: "Infrastructure and CI/CD", items: ["Docker", "GitHub Actions", "Argo Workflows"] },
    ],
  },
};
