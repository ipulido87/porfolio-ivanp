import type { pages as es } from "../es/pages";

export const pages: typeof es = {
  services: {
    seo: {
      title: "Custom software, AI automation and quality",
      description:
        "Custom websites and applications, AI process automation and software quality for companies in Mallorca and Spain.",
    },
    eyebrow: "Services",
    headline: [{ text: "Everything it takes" }, { text: "to make it work.", accent: true }],
    description: "Three ways of working together, which can be combined depending on where your project is right now.",
    includesLabel: "What's included",
    idealForLabel: "Designed for",
    cta: "Let's talk about this service",
  },
  projects: {
    seo: {
      title: "Projects and example cases",
      description: "Personal projects and concepts covering web applications, marketplaces, booking systems and test automation.",
    },
    eyebrow: "Projects",
    headline: [{ text: "What I build," }, { text: "explained honestly.", accent: true }],
    description:
      "Here you'll find personal projects and concepts that show the kind of work I can do. Each card clearly states which category it belongs to.",
    legendTitle: "How to read these cards",
    legend: {
      personal: "Something real that I built myself.",
      live: "A real website, published and working.",
      concept: "An illustrative example, not work for a client.",
    },
  },
  about: {
    seo: {
      title: "About: QA Automation Engineer, full stack and AI",
      description:
        "Around eight years of experience in software quality and enterprise projects, combined with full stack development and AI to build reliable, maintainable software.",
    },
  },
  contact: {
    seo: {
      title: "Contact: tell me about your project",
      description:
        "Tell me about your idea or technical problem. Custom software built with AI, automation and quality in Mallorca and across Spain.",
    },
  },
};
