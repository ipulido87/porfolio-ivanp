import type { home as es } from "../es/home";

export const home: typeof es = {
  seo: {
    title: "Custom software built with AI in Mallorca and Spain",
    description:
      "Custom websites and applications built with AI, AI process automation and software quality for startups, SMEs and companies in Mallorca and across Spain.",
  },
  hero: {
    eyebrow: "Software built with AI and verified with engineering",
    headline: [{ text: "Ideas that become" }, { text: "software." }, { text: "Software that works.", accent: true }],
    subtitle:
      "I build custom websites and applications with AI, automate processes and verify every delivery with quality engineering, so your company gets reliable, modern and scalable software.",
    globeLabel: "Abstract digital globe with network nodes and connections in purple and cyan",
    specs: [
      { label: "Experience", value: "Around 8 years in software quality" },
      { label: "Approach", value: "Spec-driven, with AI and quality" },
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
        solution: "AI automation",
        answer: "We turn those steps into AI-powered processes that are monitored and easy to adjust.",
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
    title: "Three things, done well.",
    description: "Custom software, AI automation and quality. You can join at any stage: from an idea still taking shape to a working product that needs to improve.",
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
    title: "The specification first, then the AI.",
    description:
      "AI moves fast, but only when it knows exactly what to build. That's why I work with spec-driven development: we agree in writing what the software must do, AI helps build it and tests prove it does what was agreed.",
    steps: [
      {
        name: "Discover",
        title: "Understand the problem before talking technology",
        body: "We talk about your business, your users and your priorities to define what is worth building and what isn't.",
        note: "Goals and scope in writing",
      },
      {
        name: "Specify",
        title: "Write down what the software must do",
        body: "We turn the goals into a clear specification with acceptance criteria. It's what guides the AI, and what we use to check the result.",
        note: "A single source of truth",
      },
      {
        name: "Build with AI",
        title: "Accelerated development, with engineering review",
        body: "Specialised agents work from the specification while I direct and review every technical decision. We move in short deliveries you can try.",
        note: "Visible progress from the start",
      },
      {
        name: "Verify",
        title: "Tests decide, not gut feeling",
        body: "Automated tests check every acceptance criterion before delivery. If something doesn't meet the specification, it isn't finished.",
        note: "Traceability to every requirement",
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
    title: "AI writes code. I make sure it works.",
    body: [
      "I'm a QA Automation Engineer and full stack developer, with around eight years of experience in software quality and enterprise projects.",
      "Spending so many years looking for where software breaks changes the way you build it with AI. I work with specialised agents and specifications as the source of truth, and nothing counts as done until the tests prove it.",
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
