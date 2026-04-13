"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { MessageCircle, X } from "lucide-react";

type Sector =
  | "farmacia"
  | "restaurante"
  | "clinica"
  | "eventos"
  | "salud"
  | "educacion"
  | "finanzas"
  | "entretenimiento"
  | "diseno"
  | "ingenieria"
  | "moda"
  | "turismo"
  | "deportes"
  | "asesorias"
  | "retail"
  | "otro";
type Problema = "ventas" | "atencion" | "tiempo" | "pedidos" | "reservas" | "desconocido";
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
};

const initialLeadDraft: LeadDraft = {
  nombre: "",
  contacto: "",
  sector: "otro",
  problema: "desconocido",
  interes: "bajo",
  mensaje_original: "",
};

const initialMessages: ChatMessage[] = [
  {
    id: 1,
    role: "assistant",
    text: "Hola, soy el asistente de ReBoTech. Cuéntame tu caso y te propongo una solución concreta para tu negocio.",
  },
];

const sectorChoices: SectorChoice[] = [
  { label: "Salud", value: "salud" },
  { label: "Educación", value: "educacion" },
  { label: "Finanzas", value: "finanzas" },
  { label: "Retail", value: "retail" },
  { label: "Turismo", value: "turismo" },
  { label: "Deportes", value: "deportes" },
  { label: "Asesorías", value: "asesorias" },
  { label: "Diseño", value: "diseno" },
  { label: "Ingeniería", value: "ingenieria" },
  { label: "Moda", value: "moda" },
  { label: "Restaurante", value: "restaurante" },
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
  if (/(restaurante|bar|cafeteria|comida|delivery)/.test(input)) return "restaurante";
  if (/(clinica|consulta|paciente|medic)/.test(input)) return "clinica";
  if (/(evento deportivo|torneo|liga|partido|club deportivo|maraton)/.test(input))
    return "eventos";
  if (/(hospital|centro de salud|bienestar|fisioterapia|odontolog)/.test(input))
    return "salud";
  if (/(colegio|academia|escuela|universidad|alumno|estudiante)/.test(input))
    return "educacion";
  if (/(finanzas|financiero|banco|inversion|contable|seguros)/.test(input))
    return "finanzas";
  if (/(cine|teatro|musica|ocio|gaming|streaming|entretenimiento)/.test(input))
    return "entretenimiento";
  if (/(diseno|diseño|agencia creativa|branding|ux|ui)/.test(input)) return "diseno";
  if (/(ingenieria|ingeniería|arquitectura|obra|constructora|industrial)/.test(input))
    return "ingenieria";
  if (/(moda|tienda de ropa|boutique|textil|ecommerce de ropa)/.test(input)) return "moda";
  if (/(hotel|agencia de viajes|turismo|alojamiento|reserva de viajes)/.test(input))
    return "turismo";
  if (/(gimnasio|fitness|entrenador|centro deportivo|deportes)/.test(input)) return "deportes";
  if (/(asesoria|asesoría|consultoria|consultoría|despacho|gestoria|gestoría)/.test(input))
    return "asesorias";
  if (/(retail|tienda|comercio|punto de venta|supermercado)/.test(input)) return "retail";
  return "otro";
}

function detectProblema(input: string): Problema {
  if (/(vender|ventas|conversion|captar|leads)/.test(input)) return "ventas";
  if (/(llamadas|atencion|responder|consultas|soporte)/.test(input)) return "atencion";
  if (/(tiempo|lento|manual|horas|operativ)/.test(input)) return "tiempo";
  if (/(pedido|pedidos|orden|encargo|whatsapp)/.test(input)) return "pedidos";
  if (/(reserva|reservas|agenda|cita|turno)/.test(input)) return "reservas";
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

function rankInteres(value: NivelInteres) {
  if (value === "alto") return 3;
  if (value === "medio") return 2;
  return 1;
}

function buildSectorSolution(sector: Sector, problema: Problema) {
  const diagnostics: Record<string, Record<Problema, string>> = {
    farmacia: {
      ventas:
        "Por lo que me cuentas, aquí hay 3 problemas claros: se pierden ventas por falta de seguimiento de clientes, hay reposición reactiva en vez de planificada y no hay campañas segmentadas para recurrencia. Esto normalmente impacta en ticket medio y en clientes que no vuelven.",
      atencion:
        "Por lo que me dices, aquí veo 3 problemas claros: exceso de llamadas para consultas repetidas, atención interrumpida en mostrador y tiempos de respuesta desiguales. Esto te hace perder tiempo operativo, genera colas y afecta la experiencia del cliente.",
      tiempo:
        "Por lo que dices, aquí hay 3 problemas claros: tareas manuales de registro, doble trabajo entre canales y poca visibilidad diaria del equipo. Eso te quita horas productivas y frena decisiones rápidas.",
      pedidos:
        "En ese caso, hay 3 problemas claros: pedidos por múltiples canales sin centralizar, errores al pasar pedidos a preparación y confirmaciones tardías. Eso causa retrabajo, cancelaciones y pérdida de confianza.",
      reservas:
        "Por esto, aquí hay 2 problemas claros: coordinación manual de citas/turnos y poca trazabilidad de cambios. Esto suele generar huecos y clientes desatendidos.",
      desconocido:
        "Aquí detecto que hay oportunidades claras en atención, pedidos y seguimiento comercial; normalmente ahí se pierde más tiempo y clientes en farmacia.",
    },
    restaurante: {
      ventas:
        "Por lo que me cuentas, aquí hay 3 problemas claros: falta de seguimiento post-visita, baja repetición de clientes y poca activación en horas valle. Eso impacta ingresos semanales de forma directa.",
      atencion:
        "Por lo que me das, aquí hay 3 problemas claros: saturación en picos, respuestas tardías por WhatsApp y consultas repetitivas que consumen al equipo. Esto te hace perder reservas y pedidos.",
      tiempo:
        "Por lo que me dices, aquí veo 2 problemas claros: demasiada coordinación manual y poca automatización de tareas recurrentes. Eso le quita foco al servicio y a la venta.",
      pedidos:
        "Por esto, aquí hay 3 problemas claros: pedidos dispersos por canal, errores de captura y confirmaciones lentas. Esto termina en retrasos, devoluciones y reseñas negativas.",
      reservas:
        "En ese caso, hay 3 problemas claros: reservas manuales, huecos por no-show y poca confirmación previa. Eso te hace perder mesas e ingresos por turno.",
      desconocido:
        "Por lo que me comentas, en restauración suele haber impacto fuerte en reservas, pedidos y atención en picos; ahí es donde más dinero se escapa.",
    },
    eventos: {
      ventas:
        "Por lo que me cuentas, aquí hay 2 problemas claros: presupuestos sin seguimiento y baja conversión de consultas a reservas cerradas. Eso impacta caja mensual.",
      atencion:
        "Por la info que me das, aquí hay 3 problemas claros: respuestas tardías, información repetida y poca visibilidad del estado de cada cliente.",
      tiempo:
        "Por lo que me dices, obviamente hay 2 problemas claros: coordinación manual con proveedores y seguimiento manual de cada evento.",
      pedidos:
        "Por esto, veo que hay fricción entre solicitudes del cliente y ejecución del servicio por falta de flujo centralizado.",
      reservas:
        "Por esto, aquí se ven 3 problemas claros: reservas manuales, cambios de última hora sin control y confirmaciones tardías.",
      desconocido:
        "Por lo que me dices, en eventos suele perderse mucho tiempo en coordinación y seguimiento comercial.",
    },
    clinica: {
      ventas:
        "Por lo que me cuentas, aquí hay 2 problemas claros: baja reactivación de pacientes y seguimiento comercial poco constante. Eso reduce ocupación de agenda.",
      atencion:
        "Por lo que me dices, veo que hay 3 problemas claros: saturación telefónica, consultas repetidas y tiempos de respuesta variables. Esto afecta percepción del servicio y abandono.",
      tiempo:
        "Por lo que me dices, aquí hay 3 problemas claros: tareas administrativas manuales, confirmaciones una a una y poca automatización de recordatorios. Eso consume horas clínicas valiosas.",
      pedidos:
        "Por esto, se ve que hay fricción operativa en solicitudes y coordinación interna, lo que añade demoras y retrabajo.",
      reservas:
        "Por lo que dices, veo 3 problemas claros: gestión manual de citas, no-shows por falta de recordatorio y huecos en agenda. Esto impacta ingresos y continuidad del paciente.",
      desconocido:
        "Por lo que me comentas, en clínicas normalmente el mayor impacto está en agenda, recordatorios y atención inicial; ahí suele haber pérdida de tiempo y pacientes.",
    },
    otro: {
      ventas:
        "Por lo que me cuentas, aquí hay 2-3 problemas claros: oportunidades sin seguimiento, procesos comerciales manuales y baja recurrencia. Eso te hace perder ventas previsibles.",
      atencion:
        "Con la información que me das, aquí hay 2-3 problemas claros: consultas repetitivas, respuestas tardías y sobrecarga del equipo. Esto afecta experiencia y conversión.",
      tiempo:
        "Por lo que dices, aquí hay 2-3 problemas claros: tareas operativas manuales, duplicidad de trabajo y poca trazabilidad. Eso se traduce en horas perdidas cada semana.",
      pedidos:
        "Con esto que me das, aquí hay 2-3 problemas claros: pedidos dispersos, errores de captura y confirmaciones lentas. Eso impacta rentabilidad y satisfacción.",
      reservas:
        "Con esta información, aquí hay 2-3 problemas claros: reservas sin automatizar, cambios manuales y no-shows. Eso reduce ocupación y margen.",
      desconocido:
        "Por lo que comentas, hay señales claras de ineficiencia operativa y oportunidades comerciales sin explotar.",
    },
  };

  const solutionsBySector: Record<string, string> = {
    farmacia:
      "En tu caso, haría esto: 1) automatizar consultas frecuentes y pedidos por WhatsApp/web, 2) centralizar clientes y seguimiento de recurrencia, 3) activar recordatorios y campañas simples para recompra.",
    restaurante:
      "En tu situación, haría esto: 1) automatizar reservas y confirmaciones, 2) centralizar pedidos por canal, 3) lanzar seguimiento post-visita para aumentar repetición.",
    eventos:
      "En este caso, haría esto: 1) digitalizar registro/acreditación, 2) automatizar recordatorios y cambios, 3) estructurar seguimiento comercial antes y después del evento.",
    deportes:
      "Yo en tu caso haría esto: 1) centralizar consultas y presupuestos, 2) automatizar confirmaciones y recordatorios, 3) digitalizar el flujo de seguimiento hasta el cierre.",
    clinica:
      "Yo en tu caso haría esto: 1) automatizar agenda y recordatorios, 2) filtrar consultas repetitivas con asistente inicial, 3) mejorar seguimiento para reducir ausencias.",
    otro:
      "Yo en tu caso haría esto: 1) mapear procesos repetitivos, 2) automatizar captación y atención inicial, 3) medir tiempos de respuesta y conversión para optimizar rápido.",
  };

  const sectorLabels: Record<Sector, string> = {
    farmacia: "farmacia",
    restaurante: "restaurante",
    clinica: "clinica",
    eventos: "eventos",
    deportes: "deportes",
    salud: "salud",
    educacion: "educacion",
    finanzas: "finanzas",
    entretenimiento: "entretenimiento",
    diseno: "diseño",
    ingenieria: "ingenieria",
    moda: "moda",
    turismo: "turismo",
    asesorias: "asesorias",
    retail: "retail",
    otro: "negocio",
  };

  const genericByProblema: Record<Problema, string> = {
    ventas:
      `Por lo que me cuentas, aquí hay 2-3 problemas claros en ${sectorLabels[sector]}: oportunidades sin seguimiento, baja conversión y falta de acciones comerciales consistentes. Esto impacta ingresos de forma directa.`,
    atencion:
      `Por lo que me cuentas, aquí hay 2-3 problemas claros en ${sectorLabels[sector]}: respuestas tardías, consultas repetitivas y sobrecarga del equipo. Esto afecta experiencia y pérdida de clientes.`,
    tiempo:
      `Por lo que me cuentas, aquí hay 2-3 problemas claros en ${sectorLabels[sector]}: tareas manuales, duplicidad de trabajo y poca trazabilidad. Eso se traduce en horas perdidas cada semana.`,
    pedidos:
      `Por lo que me cuentas, aquí hay 2-3 problemas claros en ${sectorLabels[sector]}: gestión dispersa de solicitudes, errores de captura y confirmaciones lentas.`,
    reservas:
      `Por lo que me cuentas, aquí hay 2-3 problemas claros en ${sectorLabels[sector]}: reservas manuales, cambios sin control y no-shows por falta de recordatorio.`,
    desconocido:
      `Por lo que me cuentas, en ${sectorLabels[sector]} hay señales claras de ineficiencia operativa y oportunidades comerciales sin explotar.`,
  };

  const genericSolution =
    "Yo en tu caso haría esto: 1) automatizar atención inicial y seguimiento, 2) digitalizar reservas/pedidos con trazabilidad, 3) medir tiempos de respuesta y conversión para mejorar rápido.";

  const diagnosticCopy = diagnostics[sector]?.[problema] ?? genericByProblema[problema];
  const solutionCopy = solutionsBySector[sector] ?? genericSolution;

  return `${diagnosticCopy} ${solutionCopy}`;
}

function nextDiscoverQuestion(lead: LeadDraft) {
  if (lead.sector === "otro") {
    return "Para orientarte mejor, ¿en qué sector estás? Ejemplos: salud, educación, finanzas, retail, turismo, deportes, asesorías, diseño, ingeniería, moda, restaurantes, farmacias o eventos.";
  }
  if (lead.problema === "desconocido")
    return "¿Qué te está afectando más ahora: ventas, atención, tiempo, pedidos o reservas?";
  return "¿Te entran más consultas por WhatsApp, llamadas o web?";
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
      sectorChoices: lead.sector === "otro" ? sectorChoices : undefined,
    };
  }

  const detectedSector = detectSector(input);
  const detectedProblema = detectProblema(input);
  const detectedInteres = detectInteres(input);

  const merged: LeadDraft = {
    ...lead,
    sector: detectedSector !== "otro" ? detectedSector : lead.sector,
    problema: detectedProblema !== "desconocido" ? detectedProblema : lead.problema,
    interes: rankInteres(detectedInteres) > rankInteres(lead.interes) ? detectedInteres : lead.interes,
    mensaje_original: lead.mensaje_original || rawInput,
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

  if (merged.sector === "otro" || merged.problema === "desconocido") {
    return {
      response: `Para darte una respuesta útil y no genérica, necesito un poco más de contexto. ${nextDiscoverQuestion(merged)} Si quieres, también puedes pulsar Probar diagnóstico o Agendar cita aquí abajo.`,
      merged,
      nextStage: "discover" as Stage,
      nextAwaitingField: "none" as AwaitingField,
      sectorChoices: merged.sector === "otro" ? sectorChoices : undefined,
    };
  }

  if (stage === "discover") {
    return {
      response: `${buildSectorSolution(merged.sector, merged.problema)} Para afinarlo a tu realidad, ¿cuántos clientes o consultas manejas al día aproximadamente?`,
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

  function resolveSolutionBySector(sector: Sector) {
    if (sector === "farmacia") return "farmafacil";
    if (sector === "restaurante") return "chatbots";
    if (sector === "clinica") return "chatbots";
    if (sector === "eventos") return "qr";
    return "contacto";
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

  async function saveLead(candidate: LeadDraft) {
    if (leadSaved || isSavingLead) return;
    const fingerprint = leadFingerprint(candidate);
    const dedupeKey = `rebotech_lead_sent_${sessionIdRef.current}_${fingerprint}`;
    if (window.sessionStorage.getItem(dedupeKey)) {
      setLeadSaved(true);
      return;
    }

    setIsSavingLead(true);
    try {
      const { email, telefono } = splitContact(candidate.contacto);
      const payload = {
        nombre: candidate.nombre,
        email,
        telefono,
        contacto: candidate.contacto,
        sector: candidate.sector,
        problema: candidate.problema,
        mensaje: candidate.mensaje_original || "Lead captado por asesor ReBoTech",
        mensaje_original: candidate.mensaje_original || "",
        solucion: resolveSolutionBySector(candidate.sector),
        origen: "asistente",
        enviar_email_usuario: false,
        enviar_email_admin: true,
        seguimiento: "pendiente",
        tipo_seguimiento: "email",
        fecha_seguimiento: "",
        observaciones_internas: "Lead captado por asesor ReBoTech",
        interes: candidate.interes,
        session_id: sessionIdRef.current,
      };
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) return;
      window.sessionStorage.setItem(dedupeKey, "1");
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

  function resetAssistant(addResetMessage = true) {
    setMessages(initialMessages);
    setLead(initialLeadDraft);
    setStage("discover");
    setAwaitingField("none");
    setLeadSaved(false);
    setInput("");
    if (addResetMessage) {
      setMessages((prev) => [
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
    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setLead(mergedLead);
    setStage("qualify");
    setAwaitingField("none");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
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
    const assistantMessage = appendAssistantMessageWithChoices(response, sectorChoices);

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setLead(merged);
    setStage(nextStage);
    setAwaitingField(nextAwaitingField);
    setInput("");

    const hasNameAndContact = Boolean(merged.nombre) && Boolean(merged.contacto);
    const hasValidSectorAndProblemAndContact =
      merged.sector !== "otro" &&
      merged.problema !== "desconocido" &&
      Boolean(merged.contacto);
    const hasHighInterestAndContact = merged.interes === "alto" && Boolean(merged.contacto);
    const shouldSave =
      !leadSaved && (hasNameAndContact || hasValidSectorAndProblemAndContact || hasHighInterestAndContact);
    if (shouldSave) {
      void saveLead(merged);
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
