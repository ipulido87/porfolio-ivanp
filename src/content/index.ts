import { defaultLocale, type Locale } from "@/config/i18n";
import { about as aboutEn } from "./en/about";
import { contact as contactEn } from "./en/contact";
import { faq as faqEn } from "./en/faq";
import { home as homeEn } from "./en/home";
import {
  cookiesPolicy as cookiesPolicyEn,
  legalNotice as legalNoticeEn,
  privacyPolicy as privacyPolicyEn,
} from "./en/legal";
import { pages as pagesEn } from "./en/pages";
import { projects as projectsEn } from "./en/projects";
import { services as servicesEn } from "./en/services";
import { ui as uiEn } from "./en/ui";
import { about } from "./es/about";
import { contact } from "./es/contact";
import { faq } from "./es/faq";
import { home } from "./es/home";
import { cookiesPolicy, legalNotice, privacyPolicy } from "./es/legal";
import { pages } from "./es/pages";
import { projects } from "./es/projects";
import { services } from "./es/services";
import { ui } from "./es/ui";

const dictionaries = {
  es: { about, contact, cookiesPolicy, faq, home, legalNotice, pages, privacyPolicy, projects, services, ui },
  en: {
    about: aboutEn,
    contact: contactEn,
    cookiesPolicy: cookiesPolicyEn,
    faq: faqEn,
    home: homeEn,
    legalNotice: legalNoticeEn,
    pages: pagesEn,
    privacyPolicy: privacyPolicyEn,
    projects: projectsEn,
    services: servicesEn,
    ui: uiEn,
  },
} satisfies Record<Locale, unknown>;

/** All visible copy lives in src/content. Server Components read it from here. */
export function getContent(locale: Locale = defaultLocale) {
  return dictionaries[locale];
}

export type UiContent = typeof ui;
export type ContactContent = typeof contact;
