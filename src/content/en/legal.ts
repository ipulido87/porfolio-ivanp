import { legalConfig as l } from "@/config/legal";
import { siteConfig } from "@/config/site";
import type { LegalDocument } from "@/types/content";

// Translation of src/content/es/legal.ts. The Spanish text prevails. Have both
// reviewed before launch.

const prevails = {
  heading: "Language",
  paragraphs: ["This English version is provided for convenience. If there is any discrepancy, the Spanish version prevails."],
};

export const legalNotice: LegalDocument = {
  title: "Legal notice",
  description: `Legal information about the owner of ${siteConfig.name} and the terms of use of this website.`,
  intro: "In compliance with Spanish Law 34/2002 on Information Society Services and Electronic Commerce (LSSI-CE), the following details are provided.",
  sections: [
    {
      heading: "Website owner",
      items: [
        `Owner: ${l.ownerName}`,
        `Tax ID: ${l.taxId}`,
        `Address: ${l.address}`,
        `Email: ${l.email}`,
        `Trading name: ${siteConfig.name}`,
      ],
    },
    {
      heading: "Purpose",
      paragraphs: [
        "This website provides information about software development, artificial intelligence automation and software quality services, and allows visitors to contact the owner.",
      ],
    },
    {
      heading: "Terms of use",
      paragraphs: [
        "Access to this website is free and makes you a user. You agree to use the content appropriately and not to use it for unlawful activities or in ways that could harm the site or third parties.",
      ],
    },
    {
      heading: "Intellectual and industrial property",
      paragraphs: [
        "The text, designs, graphics and code on this site belong to its owner or are used with due authorisation. Reproducing or distributing them without prior consent is prohibited, except where the law allows it.",
      ],
    },
    {
      heading: "Liability",
      paragraphs: [
        "The owner strives to keep the published information correct and up to date, but does not guarantee that it is free from errors or that the site will always be available. Projects labelled \"Concept\" are illustrative examples and do not represent work carried out for clients.",
      ],
    },
    {
      heading: "Applicable law",
      paragraphs: ["These terms are governed by Spanish law."],
    },
    prevails,
  ],
};

export const privacyPolicy: LegalDocument = {
  title: "Privacy policy",
  description: `How ${siteConfig.name} processes the personal data sent through the contact form.`,
  intro: "This policy explains what personal data is processed on this website, for what purpose and what rights you have, in accordance with Regulation (EU) 2016/679 (GDPR) and Spanish Organic Law 3/2018 (LOPDGDD).",
  sections: [
    {
      heading: "Data controller",
      items: [`Controller: ${l.ownerName}`, `Tax ID: ${l.taxId}`, `Address: ${l.address}`, `Email: ${l.email}`],
    },
    {
      heading: "Data processed",
      paragraphs: ["The contact form collects:"],
      items: [
        "Your name and email address.",
        "Your company, if you choose to give it.",
        "The starting point you select, the type of service and an approximate budget, the last being optional.",
        "The description of your project.",
        "The website language you used.",
        "The date you accepted this policy.",
        "A pseudonymised identifier derived from your IP address, which is never stored in clear text and is used only to prevent abuse.",
      ],
    },
    {
      heading: "Purpose and legal basis",
      items: [
        "To reply to your request and, where appropriate, prepare a proposal: your consent and steps taken before entering into a contract (Art. 6.1.a and 6.1.b GDPR).",
        "To protect the form against abusive submissions: legitimate interest in the security of the service (Art. 6.1.f GDPR).",
      ],
    },
    {
      heading: "Retention",
      paragraphs: [
        "Data is kept for as long as needed to handle your request and, unless a business relationship begins, is deleted no later than 12 months after the last contact. Identifiers used to limit submissions are deleted periodically.",
      ],
    },
    {
      heading: "Recipients and data processors",
      paragraphs: ["Data is not disclosed to third parties unless required by law. The following providers act as data processors to deliver the service:"],
      items: ["Turso (database).", "Resend (email notifications).", `${l.hostingProvider} (web hosting).`],
    },
    {
      heading: "International transfers",
      paragraphs: [
        "Some of these providers may process data outside the European Economic Area. In those cases, the transfer relies on the safeguards set out in the GDPR, such as the European Commission's standard contractual clauses.",
      ],
    },
    {
      heading: "Your rights",
      paragraphs: [
        `You can exercise your rights of access, rectification, erasure, objection, restriction and portability, and withdraw your consent at any time, by writing to ${l.email}.`,
        "If you believe the processing does not comply with the regulations, you can file a complaint with the Spanish Data Protection Agency (www.aepd.es).",
      ],
    },
    {
      heading: "Security",
      paragraphs: ["Technical and organisational measures are applied to protect your data, such as encrypted communications and restricted access to information."],
    },
    prevails,
    { heading: "Last updated", paragraphs: [l.lastUpdated.en] },
  ],
};

export const cookiesPolicy: LegalDocument = {
  title: "Cookie policy",
  description: `Information about the use of cookies on ${siteConfig.name}.`,
  intro: "This website does not use analytics, advertising or tracking cookies, so no consent banner is shown.",
  sections: [
    {
      heading: "What cookies are",
      paragraphs: ["Cookies are small files that a website stores on your device to remember information about your visit."],
    },
    {
      heading: "Cookies used on this site",
      paragraphs: ["This site does not currently set any first-party or third-party cookies. The contact form works without them."],
    },
    {
      heading: "WhatsApp links",
      paragraphs: ["The WhatsApp buttons are external links. When you click them you leave this site and WhatsApp's policies apply."],
    },
    {
      heading: "Changes to this policy",
      paragraphs: ["If cookies that require consent are added in future, this policy will be updated and your permission will be requested before they are set."],
    },
    prevails,
    { heading: "Last updated", paragraphs: [l.lastUpdated.en] },
  ],
};
