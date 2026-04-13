"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { MessageCircle, X } from "lucide-react";

type ChatMessage = {
  id: number;
  role: "assistant" | "user";
  text: string;
};

const initialMessages: ChatMessage[] = [
  {
    id: 1,
    role: "assistant",
    text: "Hola, soy el asistente de ReBoTech. ¿En qué puedo ayudarte?",
  },
];

function buildAssistantResponse(rawInput: string) {
  const input = rawInput.toLowerCase();

  if (input.includes("pedido")) {
    return "Puedes automatizar pedidos desde WhatsApp o web y recibirlos listos para preparar.";
  }

  if (input.includes("clientes")) {
    return "Puedes centralizar tus clientes y automatizar seguimiento sin esfuerzo.";
  }

  if (input.includes("tiempo")) {
    return "La automatización reduce tareas manuales y te ahorra varias horas cada semana.";
  }

  return "Podemos analizar tu caso y proponerte una solución adaptada.";
}

export function AssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement | null>(null);
  const nextIdRef = useRef(2);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isOpen]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    const userMessage: ChatMessage = {
      id: nextIdRef.current++,
      role: "user",
      text: trimmedInput,
    };

    const assistantMessage: ChatMessage = {
      id: nextIdRef.current++,
      role: "assistant",
      text: buildAssistantResponse(trimmedInput),
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setInput("");
  }

  return (
    <>
      {isOpen ? (
        <section className="fixed bottom-24 right-4 z-50 w-[calc(100vw-2rem)] max-w-sm rounded-3xl border border-rebo-primary/20 bg-slate-950 p-4 text-slate-100 shadow-[0_24px_60px_-30px_rgba(26,187,179,0.65)] sm:right-6 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-rebo-turquoise">
                Asistente IA
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

          <div className="mt-4 rounded-2xl border border-slate-700 bg-slate-900/80 p-3">
            <div className="max-h-64 space-y-3 overflow-y-auto pr-1">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
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
              >
                Enviar
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
        Asistente IA
      </button>
    </>
  );
}
