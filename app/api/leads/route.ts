import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

type LeadBody = {
  nombre?: string;
  empresa?: string;
  email?: string;
  telefono?: string;
  tipo_negocio?: string;
  mensaje?: string;
  solucion?: string;
  producto?: string;
};

function isNonEmpty(s: unknown): s is string {
  return typeof s === "string" && s.trim().length > 0;
}

/** URL del despliegue como app web (debe terminar en /exec). */
const GOOGLE_SCRIPT_URL =
  process.env.GOOGLE_APPS_SCRIPT_URL?.trim() ??
  process.env.GOOGLE_SCRIPT_URL?.trim() ??
  "";

export async function POST(req: Request) {
  let body: LeadBody;
  try {
    body = (await req.json()) as LeadBody;
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const nombre = body.nombre?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const telefono = body.telefono?.trim() ?? "";
  const solucion = body.solucion?.trim() ?? body.producto?.trim() ?? "";
  const tipo_negocio = body.tipo_negocio?.trim() ?? "";
  const mensajeRaw = body.mensaje?.trim() ?? "";

  const empresaRaw = body.empresa?.trim() ?? "";
  const empresa = isNonEmpty(empresaRaw) ? empresaRaw : "(No indicada)";

  const mensaje =
    telefono.length > 0
      ? `Teléfono: ${telefono}\n\n${mensajeRaw}`.trim()
      : mensajeRaw;

  if (!isNonEmpty(nombre) || !isNonEmpty(email)) {
    return NextResponse.json(
      { error: "Nombre y email son obligatorios." },
      { status: 400 },
    );
  }

  if (!email.includes("@")) {
    return NextResponse.json({ error: "Email no válido." }, { status: 400 });
  }

  if (GOOGLE_SCRIPT_URL) {
    if (!GOOGLE_SCRIPT_URL.endsWith("/exec")) {
      console.error("[leads] La URL de Apps Script debe terminar en /exec");
      return NextResponse.json(
        { error: "Configuración del servidor incompleta." },
        { status: 500 },
      );
    }

    const payload = {
      nombre,
      email,
      telefono,
      mensaje: mensajeRaw || mensaje,
      solucion: solucion || "Contacto web",
      tipo_negocio: tipo_negocio || null,
      fuente: "web-rebotech",
      submittedAt: new Date().toISOString(),
    };

    try {
      const res = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        cache: "no-store",
      });

      if (!res.ok) {
        const t = await res.text();
        console.error("[leads] Apps Script error:", res.status, t);
        return NextResponse.json(
          { error: "Error enviando lead" },
          { status: 502 },
        );
      }

      return NextResponse.json({ success: true, ok: true });
    } catch (error) {
      console.error("[leads] Apps Script fetch failed:", error);
      return NextResponse.json(
        { error: "Error enviando lead" },
        { status: 500 },
      );
    }
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (url && key) {
    const supabase = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const tipoStored = solucion || tipo_negocio || null;

    const { error } = await supabase.from("leads").insert({
      nombre,
      empresa,
      email,
      tipo_negocio: tipoStored,
      mensaje: mensaje || null,
    });

    if (error) {
      console.error("[leads] Supabase error:", error.message);
      return NextResponse.json(
        { error: "No se pudo guardar. Inténtalo de nuevo." },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, ok: true, stored: true });
  }

  console.info("[leads] Demo mode — configure GOOGLE_APPS_SCRIPT_URL or Supabase", {
    nombre,
    email,
    telefono,
    solucion,
    mensaje,
  });

  return NextResponse.json({
    success: true,
    ok: true,
    stored: false,
    demo: true,
  });
}
