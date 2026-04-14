import { NextResponse } from "next/server";
import OpenAI from "openai";

type AssistantContext = {
  sector?: string;
  problema?: string;
  interes?: string;
  stage?: string;
  awaitingField?: string;
  lead?: {
    nombre?: string;
    contacto?: string;
    sector?: string;
    problema?: string;
    interes?: string;
    mensaje_original?: string;
  };
};

type AssistantRequest = {
  message?: string;
  context?: AssistantContext;
};

function buildAssistantSystemPrompt(context: AssistantContext) {
  const sector = context.sector ?? "otro";
  const problema = context.problema ?? "desconocido";
  const interes = context.interes ?? "bajo";
  const stage = context.stage ?? "discover";
  const awaitingField = context.awaitingField ?? "none";
  const lead = context.lead ?? {};

  return [
    "Eres el asistente comercial de ReBoTech Solutions.",
    "Hablas siempre en español, con tono humano, cercano, claro y profesional.",
    "Puedes responder con naturalidad a mensajes cotidianos o fuera de tema, sin sonar robótico.",
    "Si el usuario habla de algo casual, responde breve y coherente; luego reconduce suavemente hacia negocio cuando tenga sentido.",
    "Tu objetivo principal es detectar oportunidades de negocio y guiar la conversación hacia una solución de ReBoTech.",
    "Siempre que sea posible, termina con una pregunta que avance la conversación.",
    "Si el usuario tiene un problema claro, sugiere brevemente una solución relacionada.",
    "Si el usuario no ha dado contexto de negocio, intenta obtenerlo de forma natural.",
    "No hagas respuestas largas ni técnicas, prioriza claridad y cercanía.",
    "No hagas spam ni cierres agresivos.",
    "Nunca inventes servicios ni prometas capacidades no confirmadas.",
    "No pidas todos los datos de golpe ni cierres de forma agresiva.",
    "Si el usuario ya mostró interés, intenta avanzar con suavidad hacia propuesta o demo.",
    "Si el usuario comparte nombre o contacto, responde con naturalidad y continúa guiando.",
    "Mantén respuestas breves, útiles y naturales (1 a 4 frases, más una pregunta opcional).",
    "",
    "Contexto operativo actual:",
    `- sector: ${sector}`,
    `- problema: ${problema}`,
    `- interes: ${interes}`,
    `- stage: ${stage}`,
    `- awaitingField: ${awaitingField}`,
    `- lead.nombre: ${lead.nombre ?? ""}`,
    `- lead.contacto: ${lead.contacto ?? ""}`,
    `- lead.sector: ${lead.sector ?? ""}`,
    `- lead.problema: ${lead.problema ?? ""}`,
    `- lead.interes: ${lead.interes ?? ""}`,
  ].join("\n");
}

function extractReplyText(response: OpenAI.Responses.Response) {
  const direct = response.output_text?.trim();
  if (direct) return direct;

  for (const outputItem of response.output ?? []) {
    if (outputItem.type !== "message") continue;
    for (const content of outputItem.content ?? []) {
      if (content.type === "output_text" && content.text?.trim()) {
        return content.text.trim();
      }
    }
  }

  return "";
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "OPENAI_API_KEY no configurada." }, { status: 500 });
    }

    const body = (await req.json()) as AssistantRequest;
    const message = String(body.message ?? "").trim();
    if (!message) {
      return NextResponse.json({ error: "Falta message." }, { status: 400 });
    }

    const context = body.context ?? {};
    const model = process.env.OPENAI_MODEL ?? "gpt-4.1-mini";
    const client = new OpenAI({ apiKey });

    const response = await client.responses.create({
      model,
      input: [
        {
          role: "system",
          content: [{ type: "input_text", text: buildAssistantSystemPrompt(context) }],
        },
        ...(context.lead?.mensaje_original
          ? [
              {
                role: "system" as const,
                content: [
                  {
                    type: "input_text" as const,
                    text: `Contexto previo del usuario: ${context.lead.mensaje_original}`,
                  },
                ],
              },
            ]
          : []),
        {
          role: "user",
          content: [{ type: "input_text", text: message }],
        },
      ],
    });

    const reply = extractReplyText(response);
    if (!reply) {
      return NextResponse.json({ error: "No se pudo generar respuesta." }, { status: 502 });
    }

    return NextResponse.json({ reply });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

