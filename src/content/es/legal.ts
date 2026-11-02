import { legalConfig as l } from "@/config/legal";
import { siteConfig } from "@/config/site";
import type { LegalDocument } from "@/types/content";

// Solid starting templates, not legal advice: have them reviewed before launch.

export const legalNotice: LegalDocument = {
  title: "Aviso legal",
  description: `Información legal sobre el titular y las condiciones de uso de ${siteConfig.name}.`,
  intro: "En cumplimiento de la Ley 34/2002, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se facilitan los siguientes datos.",
  sections: [
    {
      heading: "Titular del sitio web",
      items: [
        `Titular: ${l.ownerName}`,
        `NIF: ${l.taxId}`,
        `Domicilio: ${l.address}`,
        `Correo electrónico: ${l.email}`,
        `Marca comercial: ${siteConfig.name}`,
      ],
    },
    {
      heading: "Objeto",
      paragraphs: [
        "Este sitio web ofrece información sobre servicios de desarrollo de software, automatización, calidad de software y consultoría tecnológica, y permite contactar con el titular.",
      ],
    },
    {
      heading: "Condiciones de uso",
      paragraphs: [
        "El acceso a este sitio web es gratuito y atribuye la condición de persona usuaria. Te comprometes a hacer un uso adecuado de los contenidos y a no utilizarlos para actividades ilícitas o que puedan dañar el sitio o a terceros.",
      ],
    },
    {
      heading: "Propiedad intelectual e industrial",
      paragraphs: [
        "Los textos, diseños, elementos gráficos y código de este sitio pertenecen a su titular o se utilizan con la debida autorización. Queda prohibida su reproducción o distribución sin consentimiento previo, salvo en los casos permitidos por la ley.",
      ],
    },
    {
      heading: "Responsabilidad",
      paragraphs: [
        "El titular procura que la información publicada sea correcta y esté actualizada, pero no garantiza la ausencia de errores ni la disponibilidad continua del sitio. Los proyectos identificados como «Concepto» son ejemplos ilustrativos y no representan trabajos realizados para clientes.",
      ],
    },
    {
      heading: "Legislación aplicable",
      paragraphs: ["Las presentes condiciones se rigen por la legislación española."],
    },
  ],
};

export const privacyPolicy: LegalDocument = {
  title: "Política de privacidad",
  description: `Cómo trata ${siteConfig.name} los datos personales enviados a través del formulario de contacto.`,
  intro: "Esta política explica qué datos personales se tratan en este sitio web, con qué finalidad y qué derechos tienes, conforme al Reglamento (UE) 2016/679 (RGPD) y a la Ley Orgánica 3/2018 (LOPDGDD).",
  sections: [
    {
      heading: "Responsable del tratamiento",
      items: [`Responsable: ${l.ownerName}`, `NIF: ${l.taxId}`, `Domicilio: ${l.address}`, `Correo electrónico: ${l.email}`],
    },
    {
      heading: "Datos que se tratan",
      paragraphs: ["A través del formulario de contacto se recogen:"],
      items: [
        "Nombre y correo electrónico.",
        "Empresa, si decides indicarla.",
        "El punto de partida que elijas, el tipo de servicio y un presupuesto aproximado, este último opcional.",
        "La descripción de tu proyecto.",
        "El idioma de la web que hayas usado.",
        "La fecha de aceptación de esta política.",
        "Un identificador seudonimizado derivado de tu dirección IP, que no se guarda en claro y solo se usa para prevenir abusos.",
      ],
    },
    {
      heading: "Finalidad y base jurídica",
      items: [
        "Responder a tu solicitud y, en su caso, preparar una propuesta: tu consentimiento y la aplicación de medidas precontractuales (art. 6.1.a y 6.1.b RGPD).",
        "Proteger el formulario frente a envíos abusivos: interés legítimo en la seguridad del servicio (art. 6.1.f RGPD).",
      ],
    },
    {
      heading: "Conservación",
      paragraphs: [
        "Los datos se conservan durante el tiempo necesario para atender tu solicitud y, salvo que se inicie una relación comercial, se eliminan como máximo 12 meses después del último contacto. Los identificadores usados para limitar envíos se eliminan de forma periódica.",
      ],
    },
    {
      heading: "Destinatarios y encargados del tratamiento",
      paragraphs: [
        "No se ceden datos a terceros salvo obligación legal. Para prestar el servicio se utilizan proveedores que actúan como encargados del tratamiento:",
      ],
      items: [
        "Turso (base de datos).",
        "Resend (envío de notificaciones por correo electrónico).",
        `${l.hostingProvider} (alojamiento web).`,
      ],
    },
    {
      heading: "Transferencias internacionales",
      paragraphs: [
        "Algunos de estos proveedores pueden tratar datos fuera del Espacio Económico Europeo. En esos casos, la transferencia se ampara en las garantías previstas en el RGPD, como las cláusulas contractuales tipo de la Comisión Europea.",
      ],
    },
    {
      heading: "Tus derechos",
      paragraphs: [
        `Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad, así como retirar tu consentimiento en cualquier momento, escribiendo a ${l.email}.`,
        "Si consideras que el tratamiento no se ajusta a la normativa, puedes presentar una reclamación ante la Agencia Española de Protección de Datos (www.aepd.es).",
      ],
    },
    {
      heading: "Seguridad",
      paragraphs: [
        "Se aplican medidas técnicas y organizativas para proteger tus datos, como el cifrado de las comunicaciones y el acceso restringido a la información.",
      ],
    },
    { heading: "Última actualización", paragraphs: [l.lastUpdated.es] },
  ],
};

export const cookiesPolicy: LegalDocument = {
  title: "Política de cookies",
  description: `Información sobre el uso de cookies en ${siteConfig.name}.`,
  intro: "Este sitio web no utiliza cookies de analítica, publicidad ni seguimiento, por lo que no se muestra ningún banner de consentimiento.",
  sections: [
    {
      heading: "Qué son las cookies",
      paragraphs: [
        "Las cookies son pequeños archivos que un sitio web guarda en tu dispositivo para recordar información sobre tu visita.",
      ],
    },
    {
      heading: "Cookies que utiliza este sitio",
      paragraphs: [
        "Actualmente este sitio no instala cookies propias ni de terceros. El formulario de contacto funciona sin ellas.",
      ],
    },
    {
      heading: "Enlaces a WhatsApp",
      paragraphs: [
        "Los botones de WhatsApp son enlaces externos. Al pulsarlos sales de este sitio y se aplican las políticas de WhatsApp.",
      ],
    },
    {
      heading: "Cambios en esta política",
      paragraphs: [
        "Si en el futuro se incorporan cookies no exentas de consentimiento, esta política se actualizará y se solicitará tu autorización antes de instalarlas.",
      ],
    },
    { heading: "Última actualización", paragraphs: [l.lastUpdated.es] },
  ],
};
