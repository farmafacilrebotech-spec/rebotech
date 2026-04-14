"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { MessageCircle, X } from "lucide-react";

type Sector =
  | "farmacia"
  | "restaurante"
  | "clinica"
  | "eventos"
  | "deportes"
  | "otro";
type Problema = "ventas" | "atencion" | "tiempo" | "gestion" | "desconocido";
type NivelInteres = "bajo" | "medio" | "alto";
type Stage = "discover" | "qualify" | "offer" | "capture_contact" | "capture_name" | "closed";
type AwaitingField = "none" | "contacto" | "nombre";

type SectorChoice = {
  label: string;
  value: Sector;
};

type ChatMessage = {
  id: number;
  role: "assistant" | "user";
  text: string;
  sectorChoices?: SectorChoice[];
};

type LeadDraft = {
  nombre: string;
  contacto: string;
  sector: Sector;
  problema: Problema;
  interes: NivelInteres;
  mensaje_original: string;
  businessDescribed: boolean;
  businessLabel: string;
};

type AssistantContextPayload = {
  sector: Sector;
  problema: Problema;
  interes: NivelInteres;
  stage: Stage;
  awaitingField: AwaitingField;
  lead: LeadDraft;
};

const initialLeadDraft: LeadDraft = {
  nombre: "",
  contacto: "",
  sector: "otro",
  problema: "desconocido",
  interes: "bajo",
  mensaje_original: "",
  businessDescribed: false,
  businessLabel: "",
};

/** Claves que entiende el Apps Script para plantillas de email por servicio. */
const solucionesValidas = [
  "chatbots",
  "qr",
  "acreditaciones",
  "farmafacil",
  "tickets",
  "padel",
  "votaciones",
  "contacto",
  "diagnostico",
] as const;

const initialMessages: ChatMessage[] = [
  {
    id: 1,
    role: "assistant",
    text: "Hola, soy el asistente de ReBoTech. Cuéntame tu caso y te propongo una solución concreta para tu negocio.",
  },
];

const sectorChoices: SectorChoice[] = [
  { label: "Deportes", value: "deportes" },
  { label: "Restaurante", value: "restaurante" },
  { label: "Clínica", value: "clinica" },
  { label: "Farmacia", value: "farmacia" },
  { label: "Eventos", value: "eventos" },
];

function pickRandom(options: string[]) {
  return options[Math.floor(Math.random() * options.length)];
}

function isGreetingMessage(input: string) {
  return /^(hola+|buenas|buenos dias|buen día|buenas tardes|buenas noches|hey|hello)\b/i.test(
    input.trim(),
  );
}

function detectSector(input: string): Sector {
  if (/(farmacia|farmacias|farmaceutic)/.test(input)) return "farmacia";
  if (/(restaurante|bar)\b/.test(input)) return "restaurante";
  if (/(clinica|clínica|fisio|dentista)/.test(input)) return "clinica";
  if (/(evento|boda|festival)/.test(input)) return "eventos";
  if (/(deporte|torneo|padel|pádel)/.test(input)) return "deportes";
  if (/(pelu|peluqueria|peluquería|estetica|estética|belleza)/.test(input)) return "otro";
  return "otro";
}

function detectProblema(input: string): Problema {
  if (/(ventas|cobrar|pagar)/.test(input)) return "ventas";
  if (/(clientes|responder|whatsapp|atencion|atención)/.test(input)) return "atencion";
  if (/(tiempo|manual|lento)/.test(input)) return "tiempo";
  if (/(organizar|gestionar|control)/.test(input)) return "gestion";
  return "desconocido";
}

function detectInteres(input: string): NivelInteres {
  if (/(quiero|necesito|urgente|ya|cuanto|precio|demo|implement)/.test(input)) return "alto";
  if (/(me interesa|podria|tal vez|quizas|como funcion)/.test(input)) return "medio";
  return "bajo";
}

function parseNombre(input: string, awaitingName: boolean) {
  const byPhrase = input.match(/(?:me llamo|soy)\s+([a-zA-ZÀ-ÿ]+(?:\s+[a-zA-ZÀ-ÿ]+)?)/i);
  if (byPhrase) return byPhrase[1].trim();
  if (
    awaitingName &&
    /^[a-zA-ZÀ-ÿ]{2,}(?:\s+[a-zA-ZÀ-ÿ]{2,})?$/.test(input.trim()) &&
    !isGreetingMessage(input)
  ) {
    return input.trim();
  }
  return "";
}

function parseContacto(input: string) {
  const email = input.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0];
  if (email) return email;
  const phone = input.match(/(?:\+?\d[\d\s-]{6,}\d)/)?.[0];
  return phone?.trim() ?? "";
}

function detectBusinessDescription(input: string): string {
  const patterns = [
    /(?:tengo|llevo)\s+(?:un|una)\s+([a-zA-ZÀ-ÿ0-9\s]{3,40})/i,
    /trabajo\s+en\s+(?:un|una)\s+([a-zA-ZÀ-ÿ0-9\s]{3,40})/i,
    /soy\s+([a-zA-ZÀ-ÿ0-9\s]{3,40})/i,
    /vendo\s+([a-zA-ZÀ-ÿ0-9\s]{3,40})/i,
  ];

  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (!match?.[1]) continue;
    const label = match[1].trim().replace(/[.,;:!?]+$/g, "");
    if (label.length >= 3) return label;
  }
  return "";
}

function rankInteres(value: NivelInteres) {
  if (value === "alto") return 3;
  if (value === "medio") return 2;
  return 1;
}

function buildSectorSolution(sector: Sector, problema: Problema) {
  const diagnostics: Record<Sector, Record<Problema, string>> = {
    farmacia: {
      ventas: "Veo fuga de ventas por falta de seguimiento y recompra.",
      atencion: "Veo fricción en atención por consultas repetitivas y saturación del equipo.",
      tiempo: "Veo demasiado trabajo manual que consume horas operativas.",
      gestion: "Veo desorden operativo y falta de control de flujo diario.",
      desconocido: "Veo margen claro para mejorar operación y conversión en farmacia.",
    },
    restaurante: {
      ventas: "Veo impacto directo en ventas por baja recurrencia y seguimiento insuficiente.",
      atencion: "Veo pérdida de reservas por respuestas tardías y saturación en picos.",
      tiempo: "Veo tareas repetitivas que quitan foco al servicio.",
      gestion: "Veo coordinación manual sin trazabilidad entre canales y equipo.",
      desconocido: "Veo oportunidades claras para mejorar atención y flujo comercial.",
    },
    clinica: {
      ventas: "Veo pérdida de ingresos por baja reactivación de pacientes.",
      atencion: "Veo saturación en atención inicial y respuestas inconsistentes.",
      tiempo: "Veo carga administrativa manual que resta tiempo clínico.",
      gestion: "Veo agenda y seguimiento sin suficiente control operativo.",
      desconocido: "Veo oportunidad de mejorar agenda, atención y seguimiento.",
    },
    eventos: {
      ventas: "Veo oportunidades de ticketing y conversión sin sistematizar.",
      atencion: "Veo fricción en comunicación y seguimiento de asistentes.",
      tiempo: "Veo demasiada coordinación manual para la operación del evento.",
      gestion: "Veo necesidad de control de accesos y acreditaciones.",
      desconocido: "Veo margen para automatizar registro y seguimiento comercial.",
    },
    deportes: {
      ventas: "Veo margen para monetizar mejor torneos y reservas.",
      atencion: "Veo consultas repetidas que saturan la atención.",
      tiempo: "Veo procesos manuales que frenan la operación.",
      gestion: "Veo necesidad de ordenar gestión de canchas/turnos y control.",
      desconocido: "Veo oportunidad para digitalizar gestión deportiva.",
    },
    otro: {
      ventas: "Veo oportunidades de venta sin seguimiento consistente.",
      atencion: "Veo fricción de atención por respuestas tardías.",
      tiempo: "Veo carga manual y baja eficiencia operativa.",
      gestion: "Veo desorden operativo y poco control del flujo.",
      desconocido: "Veo oportunidades claras de automatización y control.",
    },
  };

  const solutionsBySector: Record<Sector, string> = {
    farmacia: "Propondría automatizar atención, seguimiento de clientes y recompra.",
    restaurante: "Propondría automatizar reservas, pedidos y comunicación en picos.",
    clinica: "Propondría automatizar agenda, recordatorios y preatención.",
    eventos: "Propondría digitalizar registro, acreditaciones y seguimiento.",
    deportes: "Propondría digitalizar reservas, control de turnos y comunicación.",
    otro: "Propondría mapear procesos y automatizar los cuellos de botella.",
  };

  const sectorLabels: Record<Sector, string> = {
    farmacia: "farmacia",
    restaurante: "restaurante",
    clinica: "clinica",
    eventos: "eventos",
    deportes: "deportes",
    otro: "negocio",
  };

  const genericByProblema: Record<Problema, string> = {
    ventas:
      `Por lo que me cuentas, aquí hay 2-3 problemas claros en ${sectorLabels[sector]}: oportunidades sin seguimiento, baja conversión y falta de acciones comerciales consistentes. Esto impacta ingresos de forma directa.`,
    atencion:
      `Por lo que me cuentas, aquí hay 2-3 problemas claros en ${sectorLabels[sector]}: respuestas tardías, consultas repetitivas y sobrecarga del equipo. Esto afecta experiencia y pérdida de clientes.`,
    tiempo:
      `Por lo que me cuentas, aquí hay 2-3 problemas claros en ${sectorLabels[sector]}: tareas manuales, duplicidad de trabajo y poca trazabilidad. Eso se traduce en horas perdidas cada semana.`,
    gestion:
      `Por lo que me cuentas, aquí hay 2-3 problemas claros en ${sectorLabels[sector]}: organización manual, falta de control operativo y baja trazabilidad del flujo diario.`,
    desconocido:
      `Por lo que me cuentas, en ${sectorLabels[sector]} hay señales claras de ineficiencia operativa y oportunidades comerciales sin explotar.`,
  };

  const genericSolution =
    "Yo en tu caso haría esto: automatizar atención inicial, ordenar la gestión y medir conversión semanal.";

  const diagnosticCopy = diagnostics[sector]?.[problema] ?? genericByProblema[problema];
  const solutionCopy = solutionsBySector[sector] ?? genericSolution;

  return `${diagnosticCopy} ${solutionCopy}`;
}

function nextDiscoverQuestion(lead: LeadDraft) {
  if (lead.sector === "otro" && !lead.businessDescribed) {
    return "Para orientarte mejor, ¿en qué sector estás? Ejemplos: farmacia, restaurante/bar, clinica, eventos o deportes.";
  }
  if (lead.problema === "desconocido")
    return "¿Qué te está afectando más ahora: ventas, atención, tiempo o gestión?";
  return "¿Te entran más consultas por WhatsApp, llamadas o web?";
}

function buildSystemPrompt({
  sector,
  problema,
  stage,
  variant,
}: {
  sector: Sector;
  problema: Problema;
  stage: Stage;
  variant?: "short" | "full";
}) {
  const baseRules = [
    "Eres un asistente comercial de ReBoTech, cercano, claro y útil.",
    "Responde de forma natural y humana.",
    "No inventes servicios ni uses cierre agresivo.",
    "Si el usuario habla de temas personales, responde con empatía y reconduce suavemente al negocio.",
  ];

  const stageGuide: Record<Stage, string> = {
    discover: "Prioriza entender sector y principal dolor.",
    qualify: "Cuantifica impacto en ventas, tiempo, atención o gestión.",
    offer: "Sugiere un enfoque concreto sin presión comercial.",
    capture_contact: "Pide contacto con tacto y explica para qué se usará.",
    capture_name: "Pide nombre solo para personalizar el seguimiento.",
    closed: "Cierra con agradecimiento y siguiente paso claro.",
  };

  const context = [
    `Sector detectado: ${sector}`,
    `Problema detectado: ${problema}`,
    `Fase actual: ${stage}`,
  ];

  if (variant === "short") {
    return [...baseRules, stageGuide[stage], ...context].join(" ");
  }

  const fullGuide = [
    "Responde de forma natural, adáptate al usuario y detecta necesidades reales de negocio.",
    "Estructura sugerida: 1) respuesta humana, 2) puente al negocio, 3) una pregunta concreta para avanzar.",
  ];

  return [...baseRules, ...fullGuide, stageGuide[stage], ...context].join(" ");
}

function buildAssistantResponse(
  rawInput: string,
  lead: LeadDraft,
  stage: Stage,
  awaitingField: AwaitingField,
) {
  const trimmedInput = rawInput.trim();
  const input = rawInput.toLowerCase();
  const isGreeting = isGreetingMessage(trimmedInput);
  const systemPrompt = buildSystemPrompt({
    sector: lead.sector,
    problema: lead.problema,
    stage,
    variant: stage === "discover" || stage === "qualify" ? "full" : "short",
  });
  if (process.env.NODE_ENV !== "production") {
    console.debug("[assistant] systemPrompt:", systemPrompt);
  }

  if (isGreeting) {
    return {
      response: `${pickRandom([
        "Hola, encantado de ayudarte.",
        "Hola, gracias por escribir.",
        "Buenas, te ayudo con gusto.",
      ])} ${nextDiscoverQuestion(lead)}`,
      merged: {
        ...lead,
        mensaje_original: lead.mensaje_original || rawInput,
      },
      nextStage: stage === "closed" ? "discover" : stage,
      nextAwaitingField: "none" as AwaitingField,
      sectorChoices: lead.sector === "otro" && !lead.businessDescribed ? sectorChoices : undefined,
    };
  }

  const detectedSector = detectSector(input);
  const detectedProblema = detectProblema(input);
  const detectedInteres = detectInteres(input);
  const detectedBusinessLabel = detectBusinessDescription(trimmedInput);

  const merged: LeadDraft = {
    ...lead,
    sector:
      lead.sector === "otro" && detectedSector !== "otro"
        ? detectedSector
        : lead.sector,
    problema: detectedProblema !== "desconocido" ? detectedProblema : lead.problema,
    interes: rankInteres(detectedInteres) > rankInteres(lead.interes) ? detectedInteres : lead.interes,
    mensaje_original: lead.mensaje_original || rawInput,
    businessDescribed: lead.businessDescribed || Boolean(detectedBusinessLabel),
    businessLabel: detectedBusinessLabel || lead.businessLabel,
  };

  const parsedContacto = parseContacto(rawInput);
  if (parsedContacto) merged.contacto = parsedContacto;

  const parsedNombre = parseNombre(rawInput, awaitingField === "nombre");
  if (parsedNombre) merged.nombre = parsedNombre;

  if (stage === "capture_contact") {
    if (!merged.contacto) {
      return {
        response:
          "Perfecto. Para enviarte la propuesta, compárteme tu email o WhatsApp. Si prefieres avanzar ya, puedes pulsar Probar diagnóstico o Agendar cita aquí abajo.",
        merged,
        nextStage: "capture_contact" as Stage,
        nextAwaitingField: "contacto" as AwaitingField,
      };
    }
    return {
      response:
        "Genial. Para personalizarte mejor la propuesta, ¿con quien tengo el gusto de hablar? Si te resulta más cómodo, también puedes usar Probar diagnóstico o Agendar cita abajo.",
      merged,
      nextStage: "capture_name" as Stage,
      nextAwaitingField: "nombre" as AwaitingField,
    };
  }

  if (stage === "capture_name") {
    if (!merged.nombre) {
      return {
        response: "Perfecto, dime tu nombre y te la preparamos a medida.",
        merged,
        nextStage: "capture_name" as Stage,
        nextAwaitingField: "nombre" as AwaitingField,
      };
    }
    return {
      response: `Excelente, ${merged.nombre}. Te preparo una propuesta concreta y te la envío por ${merged.contacto.includes("@") ? "email" : "WhatsApp"}.`,
      merged,
      nextStage: "closed" as Stage,
      nextAwaitingField: "none" as AwaitingField,
    };
  }

  if (
    (merged.sector === "otro" && !merged.businessDescribed) ||
    merged.problema === "desconocido"
  ) {
    const negocio = merged.businessLabel || "tu negocio";

    const businessPrompt =
      merged.sector === "otro" && merged.businessDescribed
        ? `Perfecto, entiendo que tienes ${negocio}. En negocios como el tuyo suele haber bastante margen para mejorar reservas, atención al cliente y organización interna. ¿Qué te gustaría optimizar más ahora: reservas, atención, tiempo, gestión o ventas?`
        : `Para orientarte mejor, ${nextDiscoverQuestion(merged)} Si quieres, también puedes pulsar Probar diagnóstico o Agendar cita aquí abajo.`;
    return {
      response: businessPrompt,
      merged,
      nextStage: "discover" as Stage,
      nextAwaitingField: "none" as AwaitingField,
      sectorChoices: merged.sector === "otro" && !merged.businessDescribed ? sectorChoices : undefined,
    };
  }

  if (stage === "discover") {
    const negocio = merged.businessLabel || merged.sector;
    return {
      response: `${buildSectorSolution(merged.sector, merged.problema)} En tu caso (${negocio}) esto suele tener impacto directo bastante rápido. Para afinarlo a tu realidad, ¿cuántos clientes o consultas manejas al día aproximadamente?`,
      merged,
      nextStage: "qualify" as Stage,
      nextAwaitingField: "none" as AwaitingField,
    };
  }

  if (stage === "qualify") {
    return {
      response:
        "Con ese contexto, el siguiente paso es priorizar un flujo de alto impacto (captación, atención inicial o seguimiento) y medir mejora en tiempo y conversión desde la primera semana. Si quieres, vemos tu caso en detalle y te preparo una mini propuesta. ¿Te la envío por email o WhatsApp? También puedes pulsar Probar diagnóstico o Agendar cita aquí abajo.",
      merged,
      nextStage: "offer" as Stage,
      nextAwaitingField: "none" as AwaitingField,
    };
  }

  if (stage === "offer") {
    if (merged.contacto) {
      return {
        response:
          "Perfecto. Y con quien tengo el gusto de hablar para personalizarla todavía más? Si prefieres, puedes continuar con Probar diagnóstico o Agendar cita abajo.",
        merged,
        nextStage: "capture_name" as Stage,
        nextAwaitingField: "nombre" as AwaitingField,
      };
    }
    return {
      response:
        "Perfecto. Compárteme tu email o WhatsApp y te envío una propuesta concreta. Si te viene mejor, también puedes usar Probar diagnóstico o Agendar cita aquí abajo.",
      merged,
      nextStage: "capture_contact" as Stage,
      nextAwaitingField: "contacto" as AwaitingField,
    };
  }

  return {
    response: `${pickRandom([
      "Hola, encantado de ayudarte.",
      "Hola, gracias por escribir.",
      "Buenas, te ayudo con gusto.",
    ])} ${nextDiscoverQuestion(merged)}`,
    merged,
    nextStage: "discover" as Stage,
    nextAwaitingField: "none" as AwaitingField,
    sectorChoices: undefined,
  };
}

export function AssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [lead, setLead] = useState<LeadDraft>(initialLeadDraft);
  const [stage, setStage] = useState<Stage>("discover");
  const [awaitingField, setAwaitingField] = useState<AwaitingField>("none");
  const [isSavingLead, setIsSavingLead] = useState(false);
  const [leadSaved, setLeadSaved] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);
  const nextIdRef = useRef(2);
  const hasProcessedQueryRef = useRef(false);
  const sessionIdRef = useRef("");

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isOpen]);

  useEffect(() => {
    if (hasProcessedQueryRef.current) return;
    hasProcessedQueryRef.current = true;

    const params = new URLSearchParams(window.location.search);
    const shouldOpen = params.get("assistant") === "open";
    const prefillMessage = params.get("q");
    const shouldOpenFromHash = window.location.hash === "#assistant";

    if (shouldOpen || shouldOpenFromHash) {
      setIsOpen(true);
    }

    if (prefillMessage) {
      setInput(prefillMessage);
    }

    if (shouldOpen || prefillMessage || shouldOpenFromHash) {
      params.delete("assistant");
      params.delete("q");
      const nextQuery = params.toString();
      const cleanUrl = `${window.location.pathname}${nextQuery ? `?${nextQuery}` : ""}`;
      window.history.replaceState(null, "", cleanUrl);
    }
  }, []);

  useEffect(() => {
    const storageKey = "rebotech_assistant_session_id";
    const existing = window.sessionStorage.getItem(storageKey);
    if (existing) {
      sessionIdRef.current = existing;
      return;
    }
    const created = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    window.sessionStorage.setItem(storageKey, created);
    sessionIdRef.current = created;
  }, []);

  function resolveSolution(sector: Sector, problema: Problema) {
    if (sector === "farmacia") return "farmafacil";

    if (sector === "restaurante") return "chatbots";
    if (sector === "clinica") return "chatbots";

    if (sector === "eventos") {
      if (problema === "gestion") return "acreditaciones";
      if (problema === "ventas") return "tickets";
      if (problema === "atencion") return "votaciones";
      return "qr";
    }

    if (sector === "deportes") {
      if (problema === "gestion") return "padel";
      if (problema === "ventas") return "tickets";
      return "qr";
    }

    return "contacto";
  }

  function formatChatTranscript(msgs: ChatMessage[]): string {
    return msgs
      .map((m) => `${m.role === "user" ? "Usuario" : "Asistente"}: ${m.text}`)
      .join("\n");
  }

  function buildAssistantLeadSummary(
    candidate: LeadDraft,
    msgs: ChatMessage[],
    solutionTag: string,
  ): string {
    const firstUser = msgs.find((m) => m.role === "user")?.text?.trim() ?? "";
    const snippet =
      firstUser.length > 220 ? `${firstUser.slice(0, 220).trim()}…` : firstUser;
    const parts = [
      `Sector: ${candidate.sector}`,
      `Necesidad detectada: ${candidate.problema}`,
      `Interés comercial: ${candidate.interes}`,
      `Propuesta orientativa: ${solutionTag}`,
      snippet ? `Resumen del caso: ${snippet}` : null,
    ].filter(Boolean);
    let summary = parts.join(". ");
    if (summary.length < 40 && snippet) {
      summary = `Lead asistente ReBoTech. ${snippet}`;
    }
    if (summary.length < 20) {
      summary =
        `Lead asistente ReBoTech. Sector ${candidate.sector}, necesidad ${candidate.problema}, propuesta ${solutionTag}.`;
    }
    return summary;
  }

  function splitContact(contacto: string) {
    const email = contacto.includes("@") ? contacto : "";
    const telefono = contacto.includes("@") ? "" : contacto;
    return { email, telefono };
  }

  function leadFingerprint(candidate: LeadDraft) {
    const base = [
      candidate.nombre.trim().toLowerCase(),
      candidate.contacto.trim().toLowerCase(),
      candidate.sector,
      candidate.problema,
      candidate.interes,
    ].join("|");
    return encodeURIComponent(base);
  }

  async function saveLead(
    candidate: LeadDraft,
    transcriptMessages: ChatMessage[],
    tipo: "nuevo" | "update",
  ) {
    if (isSavingLead) return;
    const fingerprint = leadFingerprint(candidate);
    const dedupeKey = `rebotech_lead_sent_${sessionIdRef.current}_${fingerprint}`;
    if (tipo === "nuevo" && window.sessionStorage.getItem(dedupeKey)) {
      setLeadSaved(true);
      return;
    }

    const interesDetectado = resolveSolution(candidate.sector, candidate.problema);
    const solucionFinal = (solucionesValidas as readonly string[]).includes(interesDetectado)
      ? interesDetectado
      : "contacto";

    const mensajeOriginalPreview = formatChatTranscript(transcriptMessages).trim();
    if (!mensajeOriginalPreview) {
      console.warn("[asistente] No hay historial de chat para enviar.");
      return;
    }

    setIsSavingLead(true);
    try {
      const { email, telefono } = splitContact(candidate.contacto);
      const mensajeOriginal = mensajeOriginalPreview;
      let resumen = buildAssistantLeadSummary(candidate, transcriptMessages, solucionFinal).trim();
      if (!resumen) {
        const firstLine = mensajeOriginal.split("\n")[0]?.trim() ?? "";
        resumen =
          firstLine.length > 280 ? `${firstLine.slice(0, 280)}…` : firstLine || mensajeOriginal.slice(0, 400);
      }

      const payload = {
        tipo,

        // IDENTIFICACION
        session_id: sessionIdRef.current,

        // DATOS PERSONA
        nombre: candidate.nombre || "",
        email,
        telefono,
        contacto: candidate.contacto || "",

        // CLASIFICACION NEGOCIO
        sector: candidate.sector || "otro",
        problema: candidate.problema || "desconocido",

        // NIVEL INTERES
        interes: candidate.interes || "bajo",

        // MENSAJES
        mensaje: resumen,
        mensaje_original: mensajeOriginal,

        // SOLUCION DETECTADA
        solucion: solucionFinal,

        // METADATA
        origen: "asistente",
        estado: "nuevo",

        // EMAIL FLAGS
        enviar_email_usuario: false,
        enviar_email_admin: true,

        // CRM
        seguimiento: "pendiente",
        tipo_seguimiento: "email",
        fecha_seguimiento: "",
        observaciones_internas: `Lead IA | sector:${candidate.sector} | problema:${candidate.problema} | interes:${candidate.interes}`,

        // DIAGNOSTICO
        puntuacion: "",
        nivel: "",
        resultado: "",
        recomendaciones: "",
      };

      console.log("PAYLOAD LEAD:", payload);

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) return;
      if (tipo === "nuevo") {
        window.sessionStorage.setItem(dedupeKey, "1");
      }
      setLeadSaved(true);
      setMessages((prev) => [
        ...prev,
        appendAssistantMessage("Perfecto 🙌 Te preparo algo adaptado a tu caso y te lo envio."),
      ]);
    } catch (error) {
      console.error("Error guardando lead del asistente:", error);
    } finally {
      setIsSavingLead(false);
    }
  }

  function appendAssistantMessage(text: string) {
    const assistantMessage: ChatMessage = {
      id: nextIdRef.current++,
      role: "assistant",
      text,
    };
    return assistantMessage;
  }

  function appendAssistantMessageWithChoices(text: string, choices?: SectorChoice[]) {
    const assistantMessage: ChatMessage = {
      id: nextIdRef.current++,
      role: "assistant",
      text,
      sectorChoices: choices,
    };
    return assistantMessage;
  }

  async function fetchAssistantReply(
    message: string,
    context: AssistantContextPayload,
  ): Promise<string | null> {
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, context }),
      });
      if (!res.ok) return null;
      const data = (await res.json()) as { reply?: string };
      const reply = typeof data.reply === "string" ? data.reply.trim() : "";
      return reply || null;
    } catch (error) {
      console.error("Error consultando /api/assistant:", error);
      return null;
    }
  }

  function resetAssistant(addResetMessage = true) {
    setMessages(initialMessages);
    setLead(initialLeadDraft);
    setStage("discover");
    setAwaitingField("none");
    setLeadSaved(false);
    setInput("");
    if (addResetMessage) {
      setMessages([
        ...initialMessages,
        appendAssistantMessage(
          "Perfecto, reiniciamos desde cero. Cuéntame tu caso y lo vemos paso a paso.",
        ),
      ]);
    }
  }

  function handleSectorChoice(choice: SectorChoice) {
    const userMessage: ChatMessage = {
      id: nextIdRef.current++,
      role: "user",
      text: choice.label,
    };
    const mergedLead: LeadDraft = { ...lead, sector: choice.value };
    const assistantMessage = appendAssistantMessage(
      `${buildSectorSolution(choice.value, mergedLead.problema)} Para afinarlo a tu realidad, ¿cuántos clientes o consultas manejas al día aproximadamente?`,
    );
    const nextMessages = [...messages, userMessage, assistantMessage];
    setMessages(nextMessages);
    setLead(mergedLead);
    setStage("qualify");
    setAwaitingField("none");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    const wantsReset = /(volver a empezar|empezar de nuevo|reiniciar|reset|borrar chat)/i.test(
      trimmedInput,
    );
    if (wantsReset) {
      resetAssistant(true);
      return;
    }

    const userMessage: ChatMessage = {
      id: nextIdRef.current++,
      role: "user",
      text: trimmedInput,
    };

    const { response, merged, nextStage, nextAwaitingField, sectorChoices } = buildAssistantResponse(
      trimmedInput,
      lead,
      stage,
      awaitingField,
    );

    const chatHistory = messages
      .slice(-6)
      .map((m) => `${m.role === "user" ? "Usuario" : "Asistente"}: ${m.text}`)
      .join("\n");

    const aiReply = await fetchAssistantReply(trimmedInput, {
      sector: merged.sector,
      problema: merged.problema,
      interes: merged.interes,
      stage: nextStage,
      awaitingField: nextAwaitingField,
      lead: {
        ...merged,
        mensaje_original: chatHistory,
      },
    });
    const assistantMessage = appendAssistantMessageWithChoices(aiReply ?? response, sectorChoices);

    const nextMessages = [...messages, userMessage, assistantMessage];
    setMessages(nextMessages);
    setLead(merged);
    setStage(nextStage);
    setAwaitingField(nextAwaitingField);
    setInput("");

    const hasNewName = merged.nombre && merged.nombre !== lead.nombre;
    const hasNewContact = merged.contacto && merged.contacto !== lead.contacto;
    const hasMoreConversation = messages.length > 6;
    const newInfoDetected = hasNewName || hasNewContact || hasMoreConversation;

    const hasNameAndContact = Boolean(merged.nombre) && Boolean(merged.contacto);
    const hasValidSectorAndProblemAndContact =
      merged.sector !== "otro" &&
      merged.problema !== "desconocido" &&
      Boolean(merged.contacto);
    const hasHighInterestAndContact = merged.interes === "alto" && Boolean(merged.contacto);
    const shouldCreate =
      !leadSaved && (hasNameAndContact || hasValidSectorAndProblemAndContact || hasHighInterestAndContact);
    const shouldUpdate = leadSaved && newInfoDetected;

    if (shouldCreate) {
      void saveLead(merged, nextMessages, "nuevo");
    }

    if (shouldUpdate) {
      void saveLead(merged, nextMessages, "update");
    }
  }

  return (
    <>
      {isOpen ? (
        <section className="fixed bottom-24 right-4 z-50 w-[calc(100vw-2rem)] max-w-sm rounded-3xl border border-rebo-primary/20 bg-slate-950 p-4 text-slate-100 shadow-[0_24px_60px_-30px_rgba(26,187,179,0.65)] sm:right-6 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-rebo-turquoise">
                Asesor Digital
              </p>
              <h3 className="mt-1 text-base font-bold">ReBoTech</h3>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-lg border border-slate-700 p-1.5 text-slate-200 transition hover:bg-slate-800"
              aria-label="Cerrar asistente"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <button
            type="button"
            onClick={() => resetAssistant(true)}
            className="mt-2 rounded-lg border border-slate-700 px-2.5 py-1 text-[11px] font-semibold text-slate-200 transition hover:bg-slate-800"
          >
            Reiniciar asesor
          </button>

          <div className="mt-4 rounded-2xl border border-slate-700 bg-slate-900/80 p-3">
            <div className="max-h-64 space-y-3 overflow-y-auto pr-1">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex flex-col ${message.role === "user" ? "items-end" : "items-start"}`}
                >
                  <p
                    className={`max-w-[85%] rounded-2xl px-3 py-2.5 text-xs leading-relaxed sm:text-sm ${
                      message.role === "user"
                        ? "rounded-br-md bg-rebo-primary text-white"
                        : "rounded-bl-md border border-slate-700 bg-slate-800 text-slate-100"
                    }`}
                  >
                    {message.text}
                  </p>
                  {message.role === "assistant" && message.sectorChoices?.length ? (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {message.sectorChoices.map((choice) => (
                        <button
                          key={`${message.id}-${choice.value}`}
                          type="button"
                          onClick={() => handleSectorChoice(choice)}
                          className="rounded-lg border border-rebo-turquoise/40 bg-rebo-turquoise/10 px-2.5 py-1 text-[11px] font-semibold text-rebo-turquoise transition hover:bg-rebo-turquoise/20"
                        >
                          {choice.label}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
              <div ref={endRef} />
            </div>

            <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Escribe tu pregunta..."
                className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-xs text-slate-100 outline-none transition focus:border-rebo-turquoise focus:ring-2 focus:ring-rebo-turquoise/30 sm:text-sm"
              />
              <button
                type="submit"
                className="rounded-xl bg-rebo-primary px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#159a94] sm:text-sm"
                disabled={isSavingLead}
              >
                {isSavingLead ? "Guardando..." : "Enviar"}
              </button>
            </form>
          </div>

          <div className="mt-4 flex gap-2">
            <Link
              href="/diagnostico"
              className="inline-flex flex-1 items-center justify-center rounded-xl border border-rebo-turquoise/45 bg-rebo-turquoise/10 px-3 py-2 text-xs font-semibold text-rebo-turquoise transition hover:bg-rebo-turquoise/20 sm:text-sm"
            >
              Probar diagnóstico
            </Link>
            <Link
              href="/contacto"
              className="inline-flex flex-1 items-center justify-center rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/20 sm:text-sm"
            >
              Agendar cita
            </Link>
          </div>
        </section>
      ) : null}

      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-4 z-50 inline-flex items-center gap-2 rounded-full bg-rebo-primary px-4 py-3 text-sm font-semibold text-white shadow-xl shadow-rebo-primary/35 transition hover:bg-[#159a94] sm:right-6"
        aria-label="Abrir asistente de ReBoTech"
      >
        <MessageCircle className="h-4 w-4" />
        Asesor ReBoTech
      </button>
    </>
  );
}
