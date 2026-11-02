import { getRoutes } from "@/config/site";
import type { ui as es } from "../es/ui";

const routes = getRoutes("en");

export const ui: typeof es = {
  nav: {
    label: "Main navigation",
    mobileLabel: "Mobile navigation",
    open: "Open menu",
    close: "Close menu",
    switchLanguage: { short: "ES", label: "Leer esta página en español" },
    links: [
      { href: routes.services, label: "Services" },
      { href: routes.projects, label: "Projects" },
      { href: routes.about, label: "About" },
      { href: routes.contact, label: "Contact" },
    ],
  },
  cta: {
    primary: "Tell me about your project",
    secondary: "Explore services",
    whatsapp: "Message me on WhatsApp",
    whatsappFloating: "Chat on WhatsApp",
    whatsappMessage: "Hi, I saw your website and I'd like to talk about a technology project.",
  },
  common: {
    home: "Home",
    logoLabel: "Pulido Labs, go to home page",
    skipToContent: "Skip to content",
    opensInNewTab: "opens in a new tab",
  },
  footer: {
    tagline: "Custom software built with AI, automation and quality engineering for companies that need technology to work.",
    servicesLabel: "Services",
    siteLabel: "Site",
    legal: [
      { href: routes.legal, label: "Legal notice" },
      { href: routes.privacy, label: "Privacy" },
      { href: routes.cookies, label: "Cookies" },
    ],
  },
  notFound: {
    eyebrow: "Error 404",
    title: "This page doesn't exist.",
    description: "The link may have changed, or the address may not be correct.",
    action: "Back to home",
  },
  error: {
    eyebrow: "Something went wrong",
    title: "We couldn't load this page.",
    description: "An unexpected error occurred. Please try again in a moment.",
    action: "Try again",
  },
};
