/**
 * Diagnóstico interactivo — datos, puntuación y payload exportable (email / DB / API).
 */

export type DiagnosticoLevel = "bajo" | "medio" | "alto";

export type DiagnosticoOption = {
  id: string;
  label: string;
  /** Puntos que suma esta respuesta (0–3 por pregunta → máximo 30 en 10 preguntas). */
  points: number;
};

export type DiagnosticoQuestion = {
  id: string;
  text: string;
  options: DiagnosticoOption[];
};

export const DIAGNOSTICO_QUESTIONS: DiagnosticoQuestion[] = [
  {
    id: "q1",
    text: "¿Cómo gestionas actualmente tus clientes y su historial?",
    options: [
      { id: "q1a", label: "Papel, notas sueltas o sin registro unificado", points: 0 },
      { id: "q1b", label: "Excel u hojas de cálculo compartidas", points: 1 },
      { id: "q1c", label: "CRM o software básico, pero poco usado", points: 2 },
      { id: "q1d", label: "CRM u herramienta integrada y actualizada a diario", points: 3 },
    ],
  },
  {
    id: "q2",
    text: "¿Recibes pedidos o consultas por WhatsApp o teléfono?",
    options: [
      { id: "q2a", label: "Casi todo por llamadas y chats sin orden fijo", points: 0 },
      { id: "q2b", label: "Mucho WhatsApp; a veces se pierden mensajes", points: 1 },
      { id: "q2c", label: "Plantillas o reglas, pero sigue siendo muy manual", points: 2 },
      { id: "q2d", label: "Canal digital estructurado (web, bot o integración)", points: 3 },
    ],
  },
  {
    id: "q3",
    text: "¿Tienes procesos manuales repetitivos (copiar datos, avisos, informes)?",
    options: [
      { id: "q3a", label: "Sí, muchas horas a la semana en tareas repetidas", points: 0 },
      { id: "q3b", label: "Bastantes; sabemos que molestan pero no hay plan", points: 1 },
      { id: "q3c", label: "Algunos automatizados con macros o avisos simples", points: 2 },
      { id: "q3d", label: "La mayoría está automatizado o integrado entre sistemas", points: 3 },
    ],
  },
  {
    id: "q4",
    text: "¿Usas algún software de gestión (ERP, TPV, facturación, stock)?",
    options: [
      { id: "q4a", label: "No o solo facturación mínima desconectada del resto", points: 0 },
      { id: "q4b", label: "Una herramienta principal, pero aislada de otros datos", points: 1 },
      { id: "q4c", label: "Sí, y exportamos datos manualmente a otros sitios", points: 2 },
      { id: "q4d", label: "Sí, con integraciones o API entre herramientas clave", points: 3 },
    ],
  },
  {
    id: "q5",
    text: "¿Pierdes ventas o seguimiento por falta de respuesta a tiempo?",
    options: [
      { id: "q5a", label: "Sí, con frecuencia por saturación o olvidos", points: 0 },
      { id: "q5b", label: "A veces, sobre todo en picos de demanda", points: 1 },
      { id: "q5c", label: "Poco; tenemos checklist o recordatorios manuales", points: 2 },
      { id: "q5d", label: "Casi nunca: respuesta y seguimiento están cubiertos", points: 3 },
    ],
  },
  {
    id: "q6",
    text: "¿Tu presencia digital (web, redes, formularios) genera leads medibles?",
    options: [
      { id: "q6a", label: "No tenemos web clara o no medimos nada", points: 0 },
      { id: "q6b", label: "Tenemos web pero sin formularios ni analítica útil", points: 1 },
      { id: "q6c", label: "Medimos algo, pero no conectado al CRM o ventas", points: 2 },
      { id: "q6d", label: "Embudo medible desde el primer clic hasta el cierre", points: 3 },
    ],
  },
  {
    id: "q7",
    text: "¿Cuánto tarda tu equipo en preparar informes o cuadros de mando?",
    options: [
      { id: "q7a", label: "Días o se rehacen a mano cada vez", points: 0 },
      { id: "q7b", label: "Horas; muchos copy-paste entre archivos", points: 1 },
      { id: "q7c", label: "Algún informe automático; otros siguen siendo manuales", points: 2 },
      { id: "q7d", label: "Paneles actualizados casi en tiempo real", points: 3 },
    ],
  },
  {
    id: "q8",
    text: "¿La atención al cliente fuera de horario está cubierta?",
    options: [
      { id: "q8a", label: "No; solo respondemos en horario laboral", points: 0 },
      { id: "q8b", label: "Mensaje automático genérico sin resolver dudas", points: 1 },
      { id: "q8c", label: "FAQs o bot muy básico", points: 2 },
      { id: "q8d", label: "Chatbot o flujos que resuelven parte y escalan bien", points: 3 },
    ],
  },
  {
    id: "q9",
    text: "¿Usas inteligencia artificial en procesos internos o con clientes?",
    options: [
      { id: "q9a", label: "No, ni lo hemos planteado", points: 0 },
      { id: "q9b", label: "Pruebas puntuales o solo uso personal informal", points: 1 },
      { id: "q9c", label: "En un proceso concreto (textos, clasificación, etc.)", points: 2 },
      { id: "q9d", label: "Integrada en flujos de negocio con gobierno claro", points: 3 },
    ],
  },
  {
    id: "q10",
    text: "¿Qué tan preparada está tu operación para crecer sin duplicar plantilla?",
    options: [
      { id: "q10a", label: "Crecer un 20 % nos saturaría en seguida", points: 0 },
      { id: "q10b", label: "Podríamos, pero con mucho estrés y horas extra", points: 1 },
      { id: "q10c", label: "Hay margen si priorizamos y automatizamos algo más", points: 2 },
      { id: "q10d", label: "Procesos escalables; el cuello de botella no es operativo", points: 3 },
    ],
  },
];

export const DIAGNOSTICO_MAX_SCORE = DIAGNOSTICO_QUESTIONS.length * 3;

export type DiagnosticoAnswer = {
  questionId: string;
  optionId: string;
  points: number;
};

/** Payload listo para persistir o enviar por API (versión explícita para migraciones). */
export type DiagnosticoResultPayload = {
  version: 1;
  completedAt: string;
  score: number;
  maxScore: number;
  level: DiagnosticoLevel;
  answers: DiagnosticoAnswer[];
  headline: string;
  improvementPoints: string[];
  recommendationIds: string[];
};

export const RECOMMENDATION_CATALOG = [
  {
    id: "automatizacion-pedidos",
    title: "Automatización de pedidos",
    description:
      "Flujos desde WhatsApp, web o TPV hasta preparación y avisos, sin reescribir datos a mano.",
  },
  {
    id: "atencion-digital",
    title: "Digitalización de atención al cliente",
    description:
      "Respuestas coherentes 24/7, cualificación de leads y menos carga en el equipo.",
  },
  {
    id: "integracion-sistemas",
    title: "Integración de sistemas",
    description:
      "CRM, facturación, stock y comunicaciones hablando entre sí con reglas claras.",
  },
  {
    id: "uso-ia",
    title: "Uso de IA con criterio",
    description:
      "Asistentes y automatización asistida donde aporta ROI, no por moda.",
  },
] as const;

export function computeScore(answers: DiagnosticoAnswer[]): number {
  return answers.reduce((acc, a) => acc + a.points, 0);
}

export function levelFromScore(score: number): DiagnosticoLevel {
  if (score <= 10) return "bajo";
  if (score <= 20) return "medio";
  return "alto";
}

export function levelLabel(level: DiagnosticoLevel): string {
  switch (level) {
    case "bajo":
      return "Bajo";
    case "medio":
      return "Medio";
    case "alto":
      return "Alto";
    default:
      return level;
  }
}

export function levelHeadline(level: DiagnosticoLevel): string {
  switch (level) {
    case "bajo":
      return "Gran oportunidad de mejora";
    case "medio":
      return "Tienes base, pero estás perdiendo eficiencia";
    case "alto":
      return "Buen nivel, pero puedes optimizar aún más";
    default:
      return "";
  }
}

export function improvementPointsForLevel(level: DiagnosticoLevel): string[] {
  switch (level) {
    case "bajo":
      return [
        "Unificar canales (WhatsApp, teléfono, email) en flujos que no dependan de la memoria del equipo.",
        "Sustituir hojas sueltas y copiar-pegar por datos conectados entre ventas y operación.",
        "Definir prioridades rápidas: qué automatizar primero para liberar horas esta misma temporada.",
      ];
    case "medio":
      return [
        "Cerrar huecos entre herramientas: menos exportaciones manuales y menos errores.",
        "Mejorar tiempos de respuesta y seguimiento comercial con disparadores automáticos.",
        "Medir embudo y operación con indicadores simples, no solo al cierre de mes.",
      ];
    case "alto":
      return [
        "Afinar integraciones y reglas de negocio para reducir excepciones manuales.",
        "Escalar IA solo donde ya hay volumen y datos limpios.",
        "Revisión periódica de cuellos de botella tras picos de demanda o nuevos productos.",
      ];
    default:
      return [];
  }
}

/** Orden sugerido según nivel (todas las áreas relevantes; orden indica foco). */
export function recommendationOrderForLevel(level: DiagnosticoLevel): string[] {
  const all = RECOMMENDATION_CATALOG.map((r) => r.id);
  switch (level) {
    case "bajo":
      return ["atencion-digital", "automatizacion-pedidos", "integracion-sistemas", "uso-ia"];
    case "medio":
      return ["integracion-sistemas", "automatizacion-pedidos", "atencion-digital", "uso-ia"];
    case "alto":
      return ["uso-ia", "integracion-sistemas", "automatizacion-pedidos", "atencion-digital"];
    default:
      return [...all];
  }
}

export function buildDiagnosticoPayload(answers: DiagnosticoAnswer[]): DiagnosticoResultPayload {
  const score = computeScore(answers);
  const level = levelFromScore(score);
  const headline = levelHeadline(level);
  const improvementPoints = improvementPointsForLevel(level);
  const recommendationIds = recommendationOrderForLevel(level);

  return {
    version: 1,
    completedAt: new Date().toISOString(),
    score,
    maxScore: DIAGNOSTICO_MAX_SCORE,
    level,
    answers,
    headline,
    improvementPoints,
    recommendationIds,
  };
}

export const DIAGNOSTICO_SESSION_KEY = "rebotech_diagnostico_last_v1";

export function serializeDiagnosticoPayload(payload: DiagnosticoResultPayload): string {
  return JSON.stringify(payload);
}

/** Útil en el cliente para recuperar el último resultado (p. ej. pre-rellenar email o API). */
export function parseDiagnosticoResultPayload(raw: string): DiagnosticoResultPayload | null {
  try {
    const o = JSON.parse(raw) as DiagnosticoResultPayload;
    if (o?.version !== 1 || typeof o.score !== "number") return null;
    return o;
  } catch {
    return null;
  }
}

/** Texto listo para el campo mensaje del lead tras completar el diagnóstico. */
export function buildDiagnosticoResumen(payload: DiagnosticoResultPayload): string {
  const nivel = levelLabel(payload.level);
  const [m1, m2, m3] = payload.improvementPoints;
  return `Nivel: ${nivel}
Puntuación: ${payload.score}/${payload.maxScore}
Principales mejoras:
- ${m1}
- ${m2}
- ${m3}`;
}
