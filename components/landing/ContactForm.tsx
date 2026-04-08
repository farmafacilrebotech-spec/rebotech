"use client";

import { motion } from "framer-motion";
import { Loader2, Send } from "lucide-react";
import { useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.881 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export function ContactForm({ whatsappUrl }: { whatsappUrl: string | null }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      nombre: String(fd.get("nombre") ?? ""),
      email: String(fd.get("email") ?? ""),
      telefono: String(fd.get("telefono") ?? ""),
      mensaje: String(fd.get("mensaje") ?? ""),
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { error?: string };

      if (!res.ok) {
        setErrorMsg(data.error ?? "Error al enviar");
        setStatus("error");
        return;
      }

      setStatus("success");
      form.reset();
    } catch {
      setErrorMsg("No hay conexión. Inténtalo de nuevo.");
      setStatus("error");
    }
  }

  const fieldClass =
    "w-full rounded-2xl border border-rebo-subtle bg-white px-5 py-4 text-base text-rebo-ink placeholder:text-rebo-faint outline-none transition-[border-color,box-shadow] duration-200 focus:border-rebo-primary focus:shadow-[0_0_0_4px_rgba(26,187,179,0.12),0_8px_24px_-8px_rgba(26,187,179,0.15)]";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="contact-nombre" className="mb-2 block text-sm font-semibold text-rebo-ink">
          Nombre
        </label>
        <input
          id="contact-nombre"
          name="nombre"
          required
          autoComplete="name"
          className={fieldClass}
          placeholder="Tu nombre"
        />
      </div>
      <div>
        <label htmlFor="contact-email" className="mb-2 block text-sm font-semibold text-rebo-ink">
          Email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className={fieldClass}
          placeholder="tu@empresa.com"
        />
      </div>
      <div>
        <label htmlFor="contact-telefono" className="mb-2 block text-sm font-semibold text-rebo-ink">
          Teléfono
        </label>
        <input
          id="contact-telefono"
          name="telefono"
          type="tel"
          autoComplete="tel"
          className={fieldClass}
          placeholder="+34 600 000 000"
        />
        <p className="mt-2 text-xs text-rebo-muted">
          Opcional. Si nos dejas número, podremos contactarte por teléfono si lo prefieres.
        </p>
        {whatsappUrl ? (
          <motion.a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-[#20bd5a] hover:shadow-lg"
          >
            <WhatsAppGlyph className="h-5 w-5 shrink-0" />
            Escribir por WhatsApp
          </motion.a>
        ) : null}
      </div>
      <div>
        <label htmlFor="contact-mensaje" className="mb-2 block text-sm font-semibold text-rebo-ink">
          Mensaje
        </label>
        <textarea
          id="contact-mensaje"
          name="mensaje"
          rows={5}
          required
          className={`${fieldClass} min-h-[140px] resize-y`}
          placeholder="Cuéntanos qué necesitas o qué solución te interesa…"
        />
      </div>

      {status === "success" ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          role="status"
          className="rounded-2xl border border-rebo-turquoise/40 bg-rebo-turquoise/10 px-5 py-4 text-center text-sm font-medium text-rebo-primary"
        >
          ¡Gracias! Hemos recibido tu mensaje y te responderemos pronto.
        </motion.div>
      ) : null}

      {status === "error" ? (
        <div role="alert" className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMsg}
        </div>
      ) : null}

      <motion.button
        type="submit"
        disabled={status === "loading"}
        whileHover={
          status === "loading"
            ? undefined
            : { scale: 1.02, y: -1, boxShadow: "0 20px 40px -12px rgba(26,187,179,0.45)" }
        }
        whileTap={status === "loading" ? undefined : { scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 24 }}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-rebo-primary py-4 text-base font-bold text-white shadow-lg shadow-rebo-primary/30 transition hover:bg-[#159a94] disabled:cursor-not-allowed disabled:opacity-65"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
            Enviando…
          </>
        ) : (
          <>
            Enviar mensaje
            <Send className="h-5 w-5" aria-hidden />
          </>
        )}
      </motion.button>

    </form>
  );
}
