import { NextResponse } from "next/server";

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxukDry8Stb6rwOuArdxkP1nweo5URG5XvnLFemUh0imuAjhqF2ueQMa6qSr4AIfaNVbg/exec";


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