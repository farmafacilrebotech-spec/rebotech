import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

type LeadBody = {
  nombre?: string;
  empresa?: string;
  email?: string;
  telefono?: string;
  tipo_negocio?: string;
  mensaje?: string;
};

function isNonEmpty(s: unknown): s is string {
  return typeof s === "string" && s.trim().length > 0;
}

export async function POST(request: Request) {
  let body: LeadBody;
  try {
    body = (await request.json()) as LeadBody;
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const nombre = body.nombre?.trim() ?? "";
  const empresaRaw = body.empresa?.trim() ?? "";
  const empresa = isNonEmpty(empresaRaw) ? empresaRaw : "(No indicada)";
  const email = body.email?.trim() ?? "";
  const telefono = body.telefono?.trim() ?? "";
  const tipo_negocio = body.tipo_negocio?.trim() ?? "";
  const mensajeRaw = body.mensaje?.trim() ?? "";
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

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (url && key) {
    const supabase = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { error } = await supabase.from("leads").insert({
      nombre,
      empresa,
      email,
      tipo_negocio: tipo_negocio || null,
      mensaje: mensaje || null,
    });

    if (error) {
      console.error("[leads] Supabase error:", error.message);
      return NextResponse.json(
        { error: "No se pudo guardar. Inténtalo de nuevo." },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true, stored: true });
  }

  // Sin Supabase configurado: respuesta OK para demos / desarrollo
  console.info("[leads] Demo mode — configure SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY", {
    nombre,
    empresa,
    email,
    telefono,
    tipo_negocio,
    mensaje,
  });

  return NextResponse.json({ ok: true, stored: false, demo: true });
}
