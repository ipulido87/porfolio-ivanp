import type { BudgetValue, ServiceValue, StageValue, ValidationMessages } from "@/lib/validations/lead";

export const contact = {
  eyebrow: "Contacto",
  headline: [{ text: "Cuéntame" }, { text: "tu proyecto.", accent: true }],
  description:
    "No hace falta que lo tengas todo definido. Explícame qué necesitas con tus propias palabras y te responderé personalmente.",
  aside: {
    title: "Qué ocurre después",
    steps: [
      "Leo tu mensaje y lo reviso personalmente.",
      "Te respondo para aclarar lo que haga falta.",
      "Si encaja, preparo una propuesta por escrito.",
    ],
    whatsappTitle: "¿Prefieres algo más directo?",
    whatsappBody: "También puedes escribirme por WhatsApp.",
    emailLabel: "O por correo electrónico:",
  },
  form: {
    title: "Formulario de contacto",
    steps: {
      progress: "Paso {current} de {total}",
      back: "Atrás",
      next: "Continuar",
      stage: { title: "¿En qué punto estás?", hint: "Elige lo que más se acerque. Solo son tres pasos." },
      project: {
        title: "Cuéntame qué está pasando",
        hint: "Con unas frases basta. Aunque solo sea una idea, aquí tiene cabida.",
      },
      details: { title: "¿Cómo te respondo?", hint: "Te contestaré por escrito, sin llamadas ni compromiso." },
    },
    requiredHint: "Los campos marcados con * son obligatorios.",
    optional: "opcional",
    fields: {
      stage: { label: "Punto de partida" },
      name: { label: "Nombre", placeholder: "Tu nombre" },
      email: { label: "Correo electrónico", placeholder: "tu@empresa.com" },
      company: { label: "Empresa", placeholder: "Nombre de tu empresa" },
      service: { label: "Si te ayuda, ¿qué tipo de apoyo buscas?" },
      budget: { label: "Presupuesto aproximado" },
      message: {
        label: "Tu proyecto",
        placeholder: "Qué quieres conseguir, en qué punto estás y si tienes alguna fecha en mente.",
      },
      consent: {
        before: "He leído y acepto la ",
        link: "política de privacidad",
        after: ".",
      },
      honeypot: "No rellenes este campo",
    },
    stageOptions: [
      { value: "idea", label: "Tengo una idea y quiero saber si merece la pena" },
      { value: "stuck", label: "Ya hay algo en marcha y se ha atascado" },
      { value: "build", label: "Necesito ayuda para construirlo" },
      { value: "support", label: "Busco apoyo continuo, no un trabajo puntual" },
      { value: "other", label: "Otra cosa" },
    ] satisfies { value: StageValue; label: string }[],
    serviceOptions: [
      { value: "web", label: "Web o aplicación a medida" },
      { value: "ai", label: "Automatización con IA" },
      { value: "qa", label: "Calidad y pruebas" },
      { value: "other", label: "Aún no lo tengo claro" },
    ] satisfies { value: ServiceValue; label: string }[],
    budgetOptions: [
      { value: "under-3k", label: "Menos de 3.000 €" },
      { value: "3k-10k", label: "3.000 € – 10.000 €" },
      { value: "10k-25k", label: "10.000 € – 25.000 €" },
      { value: "over-25k", label: "Más de 25.000 €" },
      { value: "unknown", label: "Aún no lo sé" },
    ] satisfies { value: BudgetValue; label: string }[],
    submit: "Enviar mensaje",
    submitting: "Enviando…",
    legalNote:
      "Usaré tus datos únicamente para responder a tu solicitud. Puedes ejercer tus derechos en cualquier momento.",
    success: {
      title: "Mensaje recibido. Gracias.",
      body: "He guardado tu solicitud y la revisaré personalmente. Te responderé al correo que me has indicado.",
      reset: "Enviar otro mensaje",
    },
    errors: {
      invalid: "Revisa los campos marcados e inténtalo de nuevo.",
      rateLimited: "Has enviado varios mensajes seguidos. Espera unos minutos antes de volver a intentarlo.",
      server: "No he podido guardar tu mensaje. Inténtalo de nuevo en unos minutos.",
      network: "No hay conexión con el servidor. Comprueba tu red e inténtalo de nuevo.",
    },
  },
  validation: {
    stage: "Elige la opción que más se acerque.",
    nameMin: "Escribe tu nombre.",
    nameMax: "El nombre es demasiado largo.",
    nameFormat: "El nombre contiene caracteres no válidos.",
    emailRequired: "Escribe tu correo electrónico.",
    emailFormat: "Escribe un correo electrónico válido, por ejemplo tu@empresa.com.",
    companyMax: "El nombre de la empresa es demasiado largo.",
    service: "Elige una opción.",
    budget: "Elige una opción válida.",
    messageMin: "Cuéntame algo más sobre el proyecto (mínimo 20 caracteres).",
    messageMax: "El mensaje es demasiado largo (máximo 5.000 caracteres).",
    consent: "Debes aceptar la política de privacidad para continuar.",
  } satisfies ValidationMessages,
};
