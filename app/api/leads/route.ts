import { NextResponse } from "next/server";

type LeadPayload = {
  nombre?: string;
  email?: string;
  telefono?: string;
  mensaje?: string;
  solucion?: string;
  contacto?: string;
  sector?: string;
  problema?: string;
  interes?: string;
  mensaje_original?: string;
  origen?: string;
  enviar_email_usuario?: boolean | string;
  enviar_email_admin?: boolean | string;
  seguimiento?: string;
  tipo_seguimiento?: string;
  fecha_seguimiento?: string;
  observaciones_internas?: string;
  session_id?: string;
};

const DEFAULT_GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxukDry8Stb6rwOuArdxkP1nweo5URG5XvnLFemUh0imuAjhqF2ueQMa6qSr4AIfaNVbg/exec";

function toBoolean(value: boolean | string | undefined, fallback: boolean) {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["true", "1", "si", "sí", "yes"].includes(normalized)) return true;
    if (["false", "0", "no"].includes(normalized)) return false;
  }
  return fallback;
}

function resolveTipoLead(solucion: string, origen: string) {
  if (solucion === "diagnostico") return "Inbound caliente";
  if (origen === "asistente") return "Asistente IA";
  return "Contacto";
}

function normalizeLead(body: LeadPayload) {
  const origen = String(body.origen ?? "web").trim().toLowerCase();
  const contacto = String(body.contacto ?? "").trim();
  const email = String(body.email ?? (contacto.includes("@") ? contacto : "")).trim();
  const telefono = String(body.telefono ?? (!contacto.includes("@") ? contacto : "")).trim();
  const solucion = String(body.solucion ?? "contacto").trim().toLowerCase();
  const mensaje = String(body.mensaje ?? "").trim();

  const defaultsByOrigin =
    origen === "asistente"
      ? {
          enviarEmailUsuario: false,
          enviarEmailAdmin: true,
          seguimiento: "pendiente",
          tipoSeguimiento: "email",
          fechaSeguimiento: "",
          observacionesInternas: "Lead captado por asistente IA",
        }
      : {
          enviarEmailUsuario: true,
          enviarEmailAdmin: false,
          seguimiento: "",
          tipoSeguimiento: "",
          fechaSeguimiento: "",
          observacionesInternas: "",
        };

  return {
    fecha: new Date().toISOString(),
    solucion,
    tipoLead: resolveTipoLead(solucion, origen),
    nombre: String(body.nombre ?? "").trim(),
    email,
    telefono,
    mensaje,
    estado: "Pendiente de contactar",
    origen,
    enviar_email_usuario: toBoolean(body.enviar_email_usuario, defaultsByOrigin.enviarEmailUsuario),
    enviar_email_admin: toBoolean(body.enviar_email_admin, defaultsByOrigin.enviarEmailAdmin),
    seguimiento: String(body.seguimiento ?? defaultsByOrigin.seguimiento).trim(),
    tipo_seguimiento: String(body.tipo_seguimiento ?? defaultsByOrigin.tipoSeguimiento).trim(),
    fecha_seguimiento: String(body.fecha_seguimiento ?? defaultsByOrigin.fechaSeguimiento).trim(),
    observaciones_internas: String(
      body.observaciones_internas ?? defaultsByOrigin.observacionesInternas,
    ).trim(),
    interes: String(body.interes ?? "bajo").trim().toLowerCase(),
    mensaje_original: String(body.mensaje_original ?? mensaje).trim(),
    sector: String(body.sector ?? "otro").trim().toLowerCase(),
    problema: String(body.problema ?? "desconocido").trim().toLowerCase(),
    session_id: String(body.session_id ?? "").trim(),
  };
}

async function saveInSupabase(lead: ReturnType<typeof normalizeLead>) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const table = process.env.SUPABASE_LEADS_TABLE ?? "leads";

  if (!supabaseUrl || !supabaseServiceRole) {
    return { ok: false, reason: "supabase_not_configured" as const };
  }

  const endpoint = `${supabaseUrl.replace(/\/+$/, "")}/rest/v1/${table}`;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: supabaseServiceRole,
      Authorization: `Bearer ${supabaseServiceRole}`,
      Prefer: "return=minimal",
    },
    body: JSON.stringify(lead),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Supabase insert failed: ${errorText}`);
  }

  return { ok: true };
}

async function saveInGoogleSheets(lead: ReturnType<typeof normalizeLead>) {
  const googleScriptUrl = process.env.GOOGLE_SCRIPT_URL ?? DEFAULT_GOOGLE_SCRIPT_URL;
  if (!googleScriptUrl) {
    return { ok: false, reason: "google_not_configured" as const };
  }

  const res = await fetch(googleScriptUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...lead,
      destino: "google_sheets",
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Google Sheets webhook failed: ${errorText}`);
  }

  return { ok: true };
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as LeadPayload;
    const lead = normalizeLead(body);

    if (!lead.nombre && !lead.email && !lead.telefono && !lead.mensaje && !lead.mensaje_original) {
      return NextResponse.json(
        { error: "Lead invalido: faltan datos minimos." },
        { status: 400 },
      );
    }

    const [supabaseResult, sheetsResult] = await Promise.allSettled([
      saveInSupabase(lead),
      saveInGoogleSheets(lead),
    ]);

    const savedInSupabase = supabaseResult.status === "fulfilled" && supabaseResult.value.ok;
    const savedInSheets = sheetsResult.status === "fulfilled" && sheetsResult.value.ok;

    if (!savedInSupabase && !savedInSheets) {
      throw new Error("No se pudo guardar el lead en ningun destino configurado.");
    }

    return NextResponse.json({
      ok: true,
      savedIn: {
        supabase: savedInSupabase,
        googleSheets: savedInSheets,
      },
      lead: {
        nombre: lead.nombre,
        solucion: lead.solucion,
        tipoLead: lead.tipoLead,
        origen: lead.origen,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}