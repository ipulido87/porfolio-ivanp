import type { home as es } from "../es/home";

export const home: typeof es = {
  seo: {
    title: "Custom software development in Mallorca and Spain",
    description:
      "Custom web applications, process automation, QA and technology consulting for startups, SMEs and companies in Mallorca and across Spain.",
  },
  hero: {
    eyebrow: "Independent software engineering studio",
    headline: [{ text: "Ideas that become" }, { text: "software." }, { text: "Software that works.", accent: true }],
    subtitle:
      "I build custom web applications, automate processes and help companies create reliable, modern and scalable digital solutions.",
    globeLabel: "Abstract digital globe with network nodes and connections in purple and cyan",
    specs: [
      { label: "Experience", value: "Around 8 years in software quality" },
      { label: "Approach", value: "Development and QA in one profile" },
      { label: "Coverage", value: "Mallorca and the rest of Spain" },
    ],
  },
  problems: {
    eyebrow: "The starting point",
    title: "Technology should solve problems, not create them.",
    description: "Most projects begin with one of these four situations. Each one has a clear way forward.",
    columns: { problem: "What's happening", solution: "How we tackle it" },
    items: [
      {
        problem: "What you need doesn't exist as a product.",
        detail: "No tool quite fits the way you work, so you end up bending the business around the software.",
        solution: "Custom software",
        answer: "We design exactly what your business needs, starting with a useful first version that can grow.",
      },
      {
        problem: "Your team repeats the same tasks by hand.",
        detail: "Copying data, preparing reports or checking emails eats up hours and invites mistakes.",
        solution: "Automation",
        answer: "We turn those steps into automatic processes that are monitored and easy to adjust.",
      },
      {
        problem: "Your software fails, or you're afraid to touch it.",
        detail: "Every change breaks something else, and nobody is sure which parts are safe to modify.",
        solution: "Quality and evolution",
        answer: "We add tests where they matter most, tidy up the code and bring back the confidence to change it.",
      },
      {
        problem: "Your systems don't talk to each other.",
        detail: "Data lives across several tools, and one of them is always out of date.",
        solution: "Integrations",
        answer: "We connect your tools through APIs so information flows without anyone passing it along by hand.",
      },
    ],
  },
  servicesIntro: {
    anchor: "services",
    eyebrow: "Services",
    title: "From first sketch to a system in production.",
    description: "You can join at any stage: from an idea still taking shape to a working product that needs to improve.",
    cardCta: "See details",
  },
  projectsIntro: {
    eyebrow: "Selected projects",
    title: "Real work and concepts, always clearly labelled.",
    description: "Every card states whether it is a personal project or an example concept.",
    action: "See all projects",
  },
  process: {
    eyebrow: "How I work",
    title: "A clear process, with no black boxes.",
    description:
      "You'll always know where things stand, what has been decided and why. The goal is to hand you something you can maintain, not something you depend on blindly.",
    steps: [
      {
        name: "Discover",
        title: "Understand the problem before talking technology",
        body: "We talk about your business, your users and your priorities to define what is worth building and what isn't.",
        note: "Goals and scope in writing",
      },
      {
        name: "Design",
        title: "Decide on the architecture and the experience",
        body: "We define flows, key screens and the technical architecture. Important decisions are documented and justified.",
        note: "Documented technical decisions",
      },
      {
        name: "Build",
        title: "Move forward in deliveries you can see",
        body: "Development in short iterations, with versions you can try. Clean, reviewable code, with no shortcuts that turn expensive later.",
        note: "Visible progress from the start",
      },
      {
        name: "Test",
        title: "Quality is part of the work",
        body: "Automated tests are written alongside the product, not at the end. Critical flows are validated before every delivery.",
        note: "Testing built into development",
      },
      {
        name: "Launch and improve",
        title: "Going live is only the beginning",
        body: "We deploy safely, watch how the product is used and plan improvements based on real data.",
        note: "Evolution and maintenance",
      },
    ],
  },
  about: {
    eyebrow: "Who's behind this",
    title: "I don't just build applications: I design them to be reliable.",
    body: [
      "I'm a QA Automation Engineer and full stack developer, with around eight years of experience in software quality and enterprise projects.",
      "Spending so many years looking for where software breaks changes the way you build it. I think about reliability, testing and long-term maintenance from the first line of code.",
    ],
    action: "See my profile",
  },
  faq: {
    eyebrow: "Frequently asked questions",
    title: "What people usually ask before starting.",
  },
  finalCta: {
    eyebrow: "Next step",
    title: "Got an idea? Let's turn it into something real.",
    description: "Tell me what you have in mind, even if it isn't fully defined. We'll look at it together and I'll give you an honest opinion.",
  },
};
