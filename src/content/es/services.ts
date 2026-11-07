import type { Service } from "@/features/services/types";

const items: Service[] = [
  {
    slug: "webs-y-aplicaciones-a-medida",
    value: "web",
    title: "Webs y aplicaciones a medida",
    summary: "Productos web de escala media, especificados antes de construirse y desarrollados con IA bajo criterio de ingeniería.",
    description:
      "Construyo webs y aplicaciones completas: frontend, backend, datos y despliegue. Primero acordamos por escrito qué debe hacer el producto; la IA acelera el desarrollo y las pruebas comprueban que cumple lo acordado.",
    visual: "web",
    includes: [
      "Especificación escrita antes de desarrollar",
      "Paneles de gestión y herramientas internas",
      "Sistemas de reservas y marketplaces",
      "Desarrollo completo con React, Next.js, Node.js y PostgreSQL",
    ],
    idealFor: "Empresas y emprendedores que necesitan algo que un producto estándar no resuelve.",
  },
  {
    slug: "automatizacion-con-ia",
    value: "ai",
    title: "Automatización con IA",
    summary: "Procesos que hoy se hacen a mano, resueltos con IA, integraciones y controles que hacen fiable el resultado.",
    description:
      "Analizo cómo trabaja tu equipo y automatizo lo que no necesita a una persona. Combino modelos de IA, integraciones y reglas deterministas, y uso la IA solo donde aporta, para que el proceso sea fiable y su coste, razonable.",
    visual: "flow",
    includes: [
      "Flujos de trabajo con agentes de IA",
      "Integraciones con tus herramientas mediante API",
      "Asistentes internos conectados a tus datos",
      "Modelos en la nube o locales, según la sensibilidad de los datos",
    ],
    idealFor: "Equipos que dedican demasiado tiempo a tareas repetitivas.",
  },
  {
    slug: "calidad-para-software-con-ia",
    value: "qa",
    title: "Calidad para software con IA",
    summary: "Pruebas automáticas y auditorías para saber que tu software funciona, lo haya escrito una persona o una IA.",
    description:
      "Es mi especialidad. Defino una estrategia de calidad según el riesgo de negocio e implanto pruebas integradas en tu proceso de entrega. También audito aplicaciones generadas con IA y corrijo lo necesario para llevarlas a producción con seguridad. Para acelerar, uso un agente propio que explora tu web y genera la primera versión de las pruebas, que reviso antes de integrarlas.",
    visual: "tests",
    includes: [
      "Estrategia de pruebas según el riesgo de negocio",
      "Pruebas E2E y de API con Playwright y RestAssured",
      "Agente propio que genera pruebas E2E a partir del flujo descrito",
      "Auditoría y rescate de aplicaciones hechas con IA",
    ],
    idealFor: "Productos en crecimiento en los que cada entrega supone un riesgo.",
  },
];

export const services = {
  items,
  // Text inside the decorative artwork on the service cards.
  art: {
    tests: ["alta de usuario", "flujo de pago", "API de pedidos", "rendimiento"],
  },
};
