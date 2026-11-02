import type { Service } from "@/features/services/types";

const items: Service[] = [
  {
    slug: "desarrollo-web-a-medida",
    value: "web",
    title: "Desarrollo web a medida",
    summary: "Plataformas, paneles, sistemas de reservas y marketplaces pensados para tu forma de trabajar, no al revés.",
    description:
      "Construyo aplicaciones web a la medida de tu negocio: desde una herramienta interna hasta una plataforma para tus clientes. Empezamos por lo que aporta más valor y crecemos a partir de ahí.",
    visual: "web",
    includes: ["Paneles de gestión y herramientas internas", "Sistemas de reservas y citas", "Marketplaces y portales de cliente", "Webs corporativas con funcionalidad propia"],
    idealFor: "Empresas y emprendedores que necesitan algo que un producto estándar no resuelve.",
  },
  {
    slug: "desarrollo-full-stack",
    value: "fullstack",
    title: "Desarrollo full stack",
    summary: "Frontend, backend, datos y despliegue con un solo responsable técnico.",
    description:
      "Me encargo del producto completo, o me incorporo a tu proyecto para reforzar lo que haga falta. Trabajo principalmente con TypeScript, React, Next.js, Node.js y PostgreSQL.",
    visual: "stack",
    includes: ["Interfaces con React y Next.js", "APIs REST con Node.js, Express o NestJS", "Modelado de datos con PostgreSQL y Prisma", "Despliegue con Docker y GitHub Actions"],
    idealFor: "Startups que construyen su producto y equipos que necesitan refuerzo técnico.",
  },
  {
    slug: "automatizacion-de-procesos",
    value: "automation",
    title: "Automatización de procesos",
    summary: "Conecta tus herramientas y elimina el trabajo repetitivo que hoy se hace a mano.",
    description:
      "Analizo cómo circula la información en tu empresa y automatizo los pasos que no necesitan a una persona: integraciones con terceros, sincronización de datos, avisos e informes.",
    visual: "flow",
    includes: ["Integraciones entre aplicaciones mediante API", "Sincronización de datos entre sistemas", "Flujos de trabajo y avisos automáticos", "Generación automática de informes"],
    idealFor: "Equipos que dedican demasiado tiempo a tareas administrativas repetitivas.",
  },
  {
    slug: "qa-y-automatizacion-de-pruebas",
    value: "qa",
    title: "QA y automatización de pruebas",
    summary: "Detecta los errores antes que tus clientes con pruebas que se ejecutan en cada cambio.",
    description:
      "Es mi especialidad. Defino una estrategia de calidad adaptada a tu producto e implanto pruebas automáticas de API, de extremo a extremo y de rendimiento, integradas en tu proceso de entrega.",
    visual: "tests",
    includes: ["Estrategia de pruebas y auditoría de calidad", "Pruebas E2E con Playwright o Selenium", "Pruebas de API con RestAssured", "Pruebas de carga con k6 e integración continua"],
    idealFor: "Productos en crecimiento en los que cada entrega supone un riesgo.",
  },
  {
    slug: "consultoria-tecnologica",
    value: "consulting",
    title: "Consultoría tecnológica",
    summary: "Una opinión técnica clara antes de invertir, para decidir con criterio.",
    description:
      "Te ayudo a tomar decisiones técnicas sin conflicto de intereses: qué construir, qué comprar, qué arquitectura elegir o cómo valorar el estado real de un proyecto que ya está en marcha.",
    visual: "compass",
    includes: ["Revisión técnica de proyectos existentes", "Definición de alcance y hoja de ruta", "Elección de arquitectura y tecnología", "Acompañamiento a equipos y proveedores"],
    idealFor: "Quien debe tomar una decisión tecnológica importante y quiere una segunda opinión.",
  },
  {
    slug: "mantenimiento-y-evolucion",
    value: "maintenance",
    title: "Mantenimiento y evolución de software",
    summary: "Tu aplicación actualizada, estable y preparada para seguir creciendo.",
    description:
      "El software necesita cuidado después del lanzamiento. Me hago cargo de corregir errores, actualizar dependencias, mejorar lo existente y añadir funciones sin poner en riesgo lo que ya funciona.",
    visual: "history",
    includes: ["Corrección de errores y mejoras continuas", "Actualización de dependencias y seguridad", "Refactorización y reducción de deuda técnica", "Nuevas funcionalidades sobre código existente"],
    idealFor: "Empresas con una aplicación en producción, sea o no desarrollada por mí.",
  },
];

export const services = {
  items,
  // Text inside the decorative artwork on the service cards.
  art: {
    layers: ["Interfaz", "API", "Datos"],
    tests: ["alta de usuario", "flujo de pago", "API de pedidos", "rendimiento"],
  },
};
