export const about = {
  eyebrow: "Sobre mí",
  headline: [{ text: "Ingeniería de software con IA," }, { text: "con mentalidad de calidad.", accent: true }],
  intro:
    "Soy QA Automation Engineer y desarrollador full stack, con unos ocho años de experiencia en calidad de software y proyectos empresariales.",
  story: {
    title: "Dos oficios, una misma obsesión: que funcione.",
    paragraphs: [
      "La calidad de software enseña a mirar un sistema desde el lado en el que falla: dónde se rompe, qué se pasó por alto y qué cuesta más corregir cuando ya está en producción.",
      "Hoy combino esa experiencia con el desarrollo full stack y la IA para ayudar a empresas a construir software a medida. No solo construyo aplicaciones: las diseño pensando desde el principio en la fiabilidad, las pruebas y el mantenimiento a largo plazo.",
    ],
  },
  aiWorkflow: {
    eyebrow: "Cómo uso la IA",
    title: "IA con método, no a ciegas.",
    description: "Aplico este enfoque tanto en entornos empresariales como en mis propios productos.",
    items: [
      {
        title: "La especificación manda",
        body: "Diseño flujos spec-driven en los que el comportamiento queda definido antes de desarrollar, y los agentes de IA trabajan a partir de esa fuente de verdad.",
      },
      {
        title: "Un equipo de agentes especializados",
        body: "En mis proyectos, agentes con roles de producto, arquitectura, desarrollo y QA colaboran en un mismo flujo, cada uno con sus propias responsabilidades.",
      },
      {
        title: "Pruebas generadas y validadas",
        body: "He creado flujos que generan casos de prueba a partir de historias de usuario, con validadores que comprueban su estructura y su trazabilidad con los criterios de aceptación.",
      },
      {
        title: "Exploración autónoma de aplicaciones",
        body: "Desarrollo agentes que exploran aplicaciones web reales, generan escenarios Gherkin y producen código Playwright mantenible, con un uso selectivo de los modelos para contener el coste.",
      },
    ],
  },
  advantages: {
    eyebrow: "Qué aporta a tu negocio",
    title: "Por qué importa combinar desarrollo y calidad.",
    items: [
      {
        title: "Menos sorpresas en producción",
        body: "Los fallos habituales se tienen en cuenta durante el diseño, en lugar de descubrirse cuando ya afectan a tus clientes.",
      },
      {
        title: "Cambios con confianza",
        body: "Con pruebas automáticas en los flujos críticos, añadir funciones no significa cruzar los dedos en cada publicación.",
      },
      {
        title: "Un coste más predecible",
        body: "Un código mantenible y bien probado ayuda a que cada mejora futura no salga más cara que la anterior.",
      },
      {
        title: "Un solo interlocutor",
        body: "Quien diseña, construye y prueba es la misma persona, así que no hay información que se pierda entre equipos.",
      },
    ],
  },
  stack: {
    eyebrow: "Tecnologías",
    title: "Herramientas con las que trabajo.",
    groups: [
      { label: "Lenguajes y frontend", items: ["Java", "TypeScript", "React", "Next.js"] },
      { label: "Backend y datos", items: ["Node.js", "Express", "NestJS", "PostgreSQL", "Prisma", "REST APIs"] },
      { label: "IA y agentes", items: ["Python", "OpenAI", "Gemini", "Ollama", "Playwright MCP", "GitHub Copilot", "OpenSpec", "Claude Code"] },
      { label: "Calidad y pruebas", items: ["Playwright", "Selenium", "RestAssured", "Cucumber", "k6", "Stryker", "SonarQube"] },
      { label: "Infraestructura y CI/CD", items: ["Docker", "GitHub Actions", "Argo Workflows"] },
    ],
  },
};
