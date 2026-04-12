import { NextResponse } from "next/server";

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxD03lgjKnzC3Sb-Drc-1YaOhYAY6_KMJ628hNxuxW8IVPpAJ5RidgoUINIi29fnHOmwg/exec";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("BODY ENVIADO:", body);

    const res = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const text = await res.text();

    console.log("RESPUESTA SCRIPT:", text);

    if (!text.includes("success")) {
      throw new Error("El script no respondió correctamente");
    }

    return NextResponse.json({ ok: true });

  } catch (error: any) {
    console.error("ERROR:", error.message);

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}