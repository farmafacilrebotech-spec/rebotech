import type { ProductIconId } from "./products";

export type SolutionGroupId = "digital" | "eventos" | "competicion";

export type SolutionSlug =
  | "farmafacil"
  | "votaciones"
  | "torneos"
  | "qr"
  | "chatbots"
  | "acreditaciones"
  | "tickets"
  | "automatizacion";

export type SolutionCardModel = {
  /** Identificador estable para leads y analítica (coincide con la URL salvo evolución futura). */
  id: SolutionSlug;
  slug: SolutionSlug;
  name: string;
  description: string;
  iconId: ProductIconId;
  group: SolutionGroupId;
  /** Tarjeta visual en home */
  cardClass: string;
  featured?: boolean;
};

export type SolutionPageModel = SolutionCardModel & {
  seoTitle: string;
  seoDescription: string;
  hero: {
    title: string;
    subtitle: string;
    ctaLabel: string;
    ctaHref: string;
  };
  problem: {
    title: string;
    body: string;
  };
  steps: { title: string; description: string }[];
  useCases: {
    title: string;
    items: string[];
  };
  finalCta: {
    title: string;
    subtitle?: string;
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel?: string;
    secondaryHref?: string;
  };
};

/** Definición en código: el `id` se asigna automáticamente igual que `slug`. */
export type SolutionPageDef = Omit<SolutionPageModel, "id">;

function withSolutionId(s: SolutionPageDef): SolutionPageModel {
  return { ...s, id: s.slug };
}

const digital: SolutionPageDef[] = [
  {
    slug: "farmafacil",
    name: "FarmaFácil",
    description: "Catálogo, pedidos y asistente con IA para farmacias.",
    iconId: "pill",
    group: "digital",
    featured: true,
    cardClass: "bg-white border-rebo-subtle shadow-sm hover:border-rebo-primary/25",
    seoTitle: "FarmaFácil — farmacia digital",
    seoDescription:
      "Digitaliza tu farmacia: catálogo online, pedidos y asistente con IA. Solicita una demo con ReBoTech Solutions.",
    hero: {
      title: "FarmaFácil",
      subtitle:
        "Vende más y atiende mejor con catálogo digital, pedidos ordenados y un asistente que responde 24/7.",
      ctaLabel: "Solicitar demo",
      ctaHref: "/contacto",
    },
    problem: {
      title: "El problema que resolvemos",
      body: "Muchas farmacias pierden tiempo en WhatsApp suelto, pedidos mal anotados y consultas repetitivas. Sin una experiencia digital clara, el cliente se va y el equipo se agota.",
    },
    steps: [
      {
        title: "Catálogo y canal de pedidos",
        description: "Tus productos y promos en un flujo guiado, sin caos en el teléfono.",
      },
      {
        title: "Asistente con IA",
        description: "Respuestas coherentes sobre horarios, disponibilidad y preguntas frecuentes.",
      },
      {
        title: "Operación alineada",
        description: "Pedidos estructurados para preparar y entregar con menos errores.",
      },
    ],
    useCases: {
      title: "Casos de uso",
      items: [
        "Farmacias urbanas con alto volumen de mensajes",
        "Redes que quieren una imagen digital uniforme",
        "Negocios que combinan mostrador y recogida",
      ],
    },
    finalCta: {
      title: "¿Encaja con tu farmacia?",
      subtitle: "Te mostramos el flujo en una sesión corta, sin compromiso.",
      primaryLabel: "Solicitar diagnóstico",
      primaryHref: "/contacto",
      secondaryLabel: "Ver todas las soluciones",
      secondaryHref: "/soluciones",
    },
  },
  {
    slug: "chatbots",
    name: "Chatbots IA",
    description: "Atención automática que suena humana cuando importa.",
    iconId: "message",
    group: "digital",
    cardClass: "bg-white border-rebo-subtle shadow-sm hover:border-rebo-primary/25",
    seoTitle: "Chatbots con IA",
    seoDescription:
      "Chatbots inteligentes para web, WhatsApp y soporte. Mejora tiempos de respuesta y conversión con ReBoTech Solutions.",
    hero: {
      title: "Chatbots con IA",
      subtitle:
        "Respuestas instantáneas, calificación de leads y soporte de primer nivel sin multiplicar plantilla.",
      ctaLabel: "Solicitar demo",
      ctaHref: "/contacto",
    },
    problem: {
      title: "El problema que resolvemos",
      body: "Los clientes esperan respuesta inmediata. Un FAQ estático no basta y un equipo humano no escala a todas las horas.",
    },
    steps: [
      {
        title: "Definimos tono y objetivos",
        description: "Qué debe resolver el bot, qué escalar a humano y qué datos captar.",
      },
      {
        title: "Entrenamiento y configuración",
        description: "Conocimiento de tu negocio conectado a tus canales reales.",
      },
      {
        title: "Medición y mejora",
        description: "Analizamos conversaciones y afinamos para más resolución y ventas.",
      },
    ],
    useCases: {
      title: "Casos de uso",
      items: [
        "E-commerce y reservas con picos de consultas",
        "Soporte técnico de nivel 1",
        "Captación y cualificación de leads B2B",
      ],
    },
    finalCta: {
      title: "Automatiza conversaciones con criterio",
      primaryLabel: "Solicitar diagnóstico",
      primaryHref: "/contacto",
      secondaryLabel: "Volver a soluciones",
      secondaryHref: "/soluciones",
    },
  },
  {
    slug: "automatizacion",
    name: "Automatización",
    description: "Menos tareas repetitivas: flujos entre herramientas y avisos donde importan.",
    iconId: "zap",
    group: "digital",
    cardClass: "bg-white border-rebo-subtle shadow-sm hover:border-rebo-primary/25",
    seoTitle: "Automatización de procesos",
    seoDescription:
      "Automatiza procesos entre sistemas, hojas de cálculo y notificaciones. ReBoTech Solutions para pymes que quieren escalar sin caos.",
    hero: {
      title: "Automatización de procesos",
      subtitle:
        "Conectamos tus herramientas para que los datos fluyan solos y el equipo deje de copiar y pegar.",
      ctaLabel: "Solicitar demo",
      ctaHref: "/contacto",
    },
    problem: {
      title: "El problema que resolvemos",
      body: "El trabajo manual entre CRM, email, Excel y otros sistemas genera errores, retrasos y coste oculto.",
    },
    steps: [
      {
        title: "Mapeo del proceso",
        description: "Detectamos cuellos de botella y qué disparadores usar.",
      },
      {
        title: "Integración y pruebas",
        description: "Flujos robustos con validación y alertas ante fallos.",
      },
      {
        title: "Operación continua",
        description: "Documentación y ajustes según cambie tu negocio.",
      },
    ],
    useCases: {
      title: "Casos de uso",
      items: [
        "Altas de clientes desde formularios al CRM",
        "Informes automáticos para dirección",
        "Sincronización de stock o pedidos",
      ],
    },
    finalCta: {
      title: "¿Qué proceso te gustaría automatizar?",
      primaryLabel: "Solicitar diagnóstico",
      primaryHref: "/contacto",
      secondaryLabel: "Ver soluciones",
      secondaryHref: "/soluciones",
    },
  },
];

const eventos: SolutionPageDef[] = [
  {
    slug: "tickets",
    name: "Sistema de tickets",
    description: "Reservas y entradas con generación y control al instante.",
    iconId: "ticket",
    group: "eventos",
    cardClass: "bg-white border-rebo-subtle shadow-sm hover:border-rebo-primary/25",
    seoTitle: "Sistema de tickets y reservas",
    seoDescription:
      "Vende entradas y gestiona reservas con tickets digitales. Solución ReBoTech para eventos y negocios con aforo.",
    hero: {
      title: "Sistema de tickets",
      subtitle:
        "Vende, valida y controla accesos sin fricción: del pago al escaneo en puerta.",
      ctaLabel: "Solicitar demo",
      ctaHref: "/contacto",
    },
    problem: {
      title: "El problema que resolvemos",
      body: "Listas en Excel, duplicados y colas lentas en acceso restan profesionalidad y dinero.",
    },
    steps: [
      {
        title: "Configuración del evento",
        description: "Tarifas, aforo, ventanas de venta y canales.",
      },
      {
        title: "Compra y emisión",
        description: "El asistente recibe su ticket listo para mostrar o imprimir.",
      },
      {
        title: "Validación",
        description: "Control de acceso rápido y trazabilidad por código.",
      },
    ],
    useCases: {
      title: "Casos de uso",
      items: [
        "Conciertos y festivales",
        "Charlas y congresos corporativos",
        "Actividades con cupo limitado",
      ],
    },
    finalCta: {
      title: "Tu próximo evento, bajo control",
      primaryLabel: "Solicitar diagnóstico",
      primaryHref: "/contacto",
      secondaryLabel: "Ver soluciones",
      secondaryHref: "/soluciones",
    },
  },
  {
    slug: "acreditaciones",
    name: "Acreditaciones inteligentes",
    description: "Altas, credenciales y acceso sin colas para eventos.",
    iconId: "badge",
    group: "eventos",
    cardClass: "bg-white border-rebo-subtle shadow-sm hover:border-rebo-primary/25",
    seoTitle: "Acreditaciones para eventos",
    seoDescription:
      "Gestión digital de acreditaciones y control de acceso para eventos profesionales. ReBoTech Solutions.",
    hero: {
      title: "Acreditaciones inteligentes",
      subtitle:
        "Registro, credenciales y acceso fluido: menos colas, más seguridad y mejor imagen.",
      ctaLabel: "Solicitar demo",
      ctaHref: "/contacto",
    },
    problem: {
      title: "El problema que resolvemos",
      body: "Colas en acreditación, datos dispersos y accesos difíciles de auditar frustran a asistentes y organización.",
    },
    steps: [
      {
        title: "Registro online",
        description: "Datos validados y listas listas antes del día del evento.",
      },
      {
        title: "Credencial digital o impresa",
        description: "Emisión clara según tu formato y normativa.",
      },
      {
        title: "Control en tiempo real",
        description: "Validación en entradas con trazabilidad por perfil.",
      },
    ],
    useCases: {
      title: "Casos de uso",
      items: [
        "Ferias y congresos B2B",
        "Eventos deportivos privados",
        "Lanzamientos y VIP",
      ],
    },
    finalCta: {
      title: "Eventos que se sienten premium",
      primaryLabel: "Solicitar diagnóstico",
      primaryHref: "/contacto",
      secondaryLabel: "Ver soluciones",
      secondaryHref: "/soluciones",
    },
  },
  {
    slug: "qr",
    name: "QR dinámico",
    description: "Del físico al digital en un escaneo: landing, ficha o campaña.",
    iconId: "qr",
    group: "eventos",
    cardClass: "bg-white border-rebo-subtle shadow-sm hover:border-rebo-primary/25",
    seoTitle: "QR dinámico para negocio",
    seoDescription:
      "Códigos QR inteligentes que enlazan a experiencias digitales medibles. ReBoTech Solutions.",
    hero: {
      title: "QR dinámico",
      subtitle:
        "Un mismo punto de contacto físico que lleva a la acción correcta: compra, registro o contenido.",
      ctaLabel: "Solicitar demo",
      ctaHref: "/contacto",
    },
    problem: {
      title: "El problema que resolvemos",
      body: "Los QR estáticos caducan con cada cambio de campaña y no cuentan qué funciona.",
    },
    steps: [
      {
        title: "Definición del destino",
        description: "Qué ve el usuario tras el escaneo y en qué dispositivos.",
      },
      {
        title: "QR gestionable",
        description: "Actualiza destino y mensajes sin reimprimir todo.",
      },
      {
        title: "Analítica ligera",
        description: "Volúmenes y conversiones para optimizar el punto físico.",
      },
    ],
    useCases: {
      title: "Casos de uso",
      items: [
        "Packaging y material promocional",
        "Stands y señalética en tienda",
        "Campañas multicanal offline-online",
      ],
    },
    finalCta: {
      title: "Conecta el mundo físico con tu digital",
      primaryLabel: "Solicitar diagnóstico",
      primaryHref: "/contacto",
      secondaryLabel: "Ver soluciones",
      secondaryHref: "/soluciones",
    },
  },
];

const competicion: SolutionPageDef[] = [
  {
    slug: "torneos",
    name: "Torneos de pádel",
    description: "Cruces, cuadros y rankings sin hojas interminables.",
    iconId: "trophy",
    group: "competicion",
    cardClass: "bg-white border-rebo-subtle shadow-sm hover:border-rebo-primary/25",
    seoTitle: "Software para torneos de pádel",
    seoDescription:
      "Gestión de torneos de pádel: inscripciones, cuadros y rankings. ReBoTech Solutions.",
    hero: {
      title: "Torneos de pádel",
      subtitle:
        "Inscripciones claras, cuadros automáticos y comunicación con jugadores sin perder un solo set de organización.",
      ctaLabel: "Solicitar demo",
      ctaHref: "/contacto",
    },
    problem: {
      title: "El problema que resolvemos",
      body: "Organizar ligas y torneos en tablas compartidas es frágil: errores, versiones y poca visibilidad para el jugador.",
    },
    steps: [
      {
        title: "Inscripción y grupos",
        description: "Cupo, categorías y confirmaciones en un solo flujo.",
      },
      {
        title: "Cuadros y calendario",
        description: "Generación de cruces y avisos a participantes.",
      },
      {
        title: "Resultados y ranking",
        description: "Actualización visible para club y público.",
      },
    ],
    useCases: {
      title: "Casos de uso",
      items: [
        "Clubes con ligas internas",
        "Torneos patrocinados de fin de semana",
        "Escuelas y academias",
      ],
    },
    finalCta: {
      title: "Lleva tu competición al siguiente nivel",
      primaryLabel: "Solicitar diagnóstico",
      primaryHref: "/contacto",
      secondaryLabel: "Ver soluciones",
      secondaryHref: "/soluciones",
    },
  },
  {
    slug: "votaciones",
    name: "Votaciones automáticas",
    description: "Votos seguros con recuento en tiempo real y trazabilidad.",
    iconId: "vote",
    group: "competicion",
    cardClass: "bg-white border-rebo-subtle shadow-sm hover:border-rebo-primary/25",
    seoTitle: "Votaciones automáticas",
    seoDescription:
      "Sistemas de votación digital con recuento en tiempo real para empresas y eventos. ReBoTech Solutions.",
    hero: {
      title: "Votaciones automáticas",
      subtitle:
        "Decisiones y premios con votación clara, control de participantes y resultados en vivo.",
      ctaLabel: "Solicitar demo",
      ctaHref: "/contacto",
    },
    problem: {
      title: "El problema que resolvemos",
      body: "Votar por email o mano alzada no escala, genera dudas y complica auditoría.",
    },
    steps: [
      {
        title: "Reglas y electores",
        description: "Quién puede votar, cuántas opciones y ventana temporal.",
      },
      {
        title: "Experiencia de voto",
        description: "Interfaz simple en móvil y escritorio.",
      },
      {
        title: "Recuento y cierre",
        description: "Resultados en tiempo real y registro para transparencia.",
      },
    ],
    useCases: {
      title: "Casos de uso",
      items: [
        "Premios internos y cultura empresa",
        "Eventos con público votante",
        "Elecciones de representantes en asociaciones",
      ],
    },
    finalCta: {
      title: "Votaciones que generan confianza",
      primaryLabel: "Solicitar diagnóstico",
      primaryHref: "/contacto",
      secondaryLabel: "Ver soluciones",
      secondaryHref: "/soluciones",
    },
  },
];

export const allSolutions: SolutionPageModel[] = [
  ...digital.map(withSolutionId),
  ...eventos.map(withSolutionId),
  ...competicion.map(withSolutionId),
];

export const solutionSlugs = allSolutions.map((s) => s.slug) as SolutionSlug[];

const bySlug = new Map(allSolutions.map((s) => [s.slug, s]));

export function getSolutionBySlug(slug: string): SolutionPageModel | undefined {
  return bySlug.get(slug as SolutionSlug);
}

export function isValidSolutionSlug(slug: string): slug is SolutionSlug {
  return bySlug.has(slug as SolutionSlug);
}

export const solutionGroups: {
  id: SolutionGroupId;
  title: string;
  description: string;
}[] = [
  {
    id: "digital",
    title: "Digitalización de negocios",
    description: "Presencia digital, conversación automatizada y procesos que escalan contigo.",
  },
  {
    id: "eventos",
    title: "Eventos y experiencias",
    description: "Acceso, credenciales y puente físico-digital para vivir el evento sin fricción.",
  },
  {
    id: "competicion",
    title: "Competición y gamificación",
    description: "Torneos y participación con reglas claras y resultados visibles.",
  },
];

export function solutionsInGroup(id: SolutionGroupId): SolutionPageModel[] {
  return allSolutions.filter((s) => s.group === id);
}
