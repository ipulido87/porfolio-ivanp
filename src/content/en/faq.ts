import type { faq as es } from "../es/faq";

export const faq: typeof es = {
  items: [
    {
      question: "What does building with AI and spec-driven development mean?",
      answer:
        "It means the process starts from a written specification: what the software must do and how we'll know it does. On that basis, AI agents speed up development and testing, while I direct and review every technical decision. AI brings speed; the specification and tests bring reliability.",
    },
    {
      question: "What happens to my data if AI is used?",
      answer:
        "Before starting, we decide together which data can go through AI tools and which can't. When information is sensitive, we can work with test data or with local models running on your own infrastructure.",
    },
    {
      question: "How much does a project cost?",
      answer:
        "It depends on the scope, the complexity and the integrations involved. That's why I don't work from a fixed price list: first I understand what you need, then I send you a written proposal with the scope and budget in detail. If your budget is limited, we'll find a first version that fits.",
    },
    {
      question: "Do you work with small companies?",
      answer:
        "Yes. I work with entrepreneurs, startups, SMEs and larger companies. In a small business every euro counts, so the focus is on solving what adds the most value first, without over-engineering the solution.",
    },
    {
      question: "Can I start with just an idea?",
      answer:
        "Of course. You don't need a requirements document or technical knowledge. We start from your idea, bring it down to earth and define a realistic first version. If after looking at it I don't think it's worth building, I'll tell you.",
    },
    {
      question: "Can you improve software I already have, even if AI built it?",
      answer:
        "Yes. We usually start with a technical review of the current state: code, architecture, bugs and risks. With that information we decide whether to evolve what's there, rewrite part of it or simply add tests before moving forward. You can also hire me for just that review.",
    },
    {
      question: "Do you offer maintenance after delivery?",
      answer:
        "Yes. I can take care of fixing bugs, keeping dependencies up to date and continuing to evolve the product. You can also handle maintenance yourself: the code is delivered documented.",
    },
    {
      question: "Can you handle just the testing?",
      answer:
        "Yes. Software quality is my specialty. I can audit your current process, define a test strategy and implement API, E2E or performance automation on an existing product, working alongside your team.",
    },
    {
      question: "What does the delivery process look like?",
      answer:
        "I work in short deliveries, so you can see and try the progress from the start. Each delivery goes through automated tests before it's published. At the end, you receive the documentation and everything needed to run the system.",
    },
  ],
};
