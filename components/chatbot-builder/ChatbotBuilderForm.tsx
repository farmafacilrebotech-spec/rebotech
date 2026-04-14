"use client";

import Link from "next/link";
import { FormStep } from "./FormStep";
import { Stepper } from "./Stepper";
import {
  ChatbotBriefing,
  DatoCapturar,
  initialBriefing,
  MomentoCaptura,
} from "./types";
import { useMemo, useState } from "react";

const steps = [
  "Empresa",
  "Negocio",
  "Objetivo",
  "FAQ",
  "Captura",
  "Personalidad",
  "Final",
];

const inputClass =
  "w-full rounded-xl border border-rebo-subtle bg-white px-4 py-3 text-sm text-rebo-ink outline-none transition focus:border-rebo-primary focus:ring-2 focus:ring-rebo-primary/20";

function toPrettyJson(value: unknown) {
  return JSON.stringify(value);
}

export function ChatbotBuilderForm() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<ChatbotBriefing>(initialBriefing);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const canContinue = useMemo(() => {
    if (step === 0) return Boolean(form.nombre_contacto && form.email && form.nombre_empresa);
    if (step === 1) return Boolean(form.descripcion_negocio && form.servicios && form.cliente_ideal);
    if (step === 2) return Boolean(form.accion_final);
    if (step === 4) return form.datos_a_capturar.length > 0 && Boolean(form.que_es_lead_caliente);
    if (step === 5) return Boolean(form.como_se_presenta);
    return true;
  }, [form, step]);

  function updateField<K extends keyof ChatbotBriefing>(key: K, value: ChatbotBriefing[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleDato(value: DatoCapturar) {
    setForm((prev) => {
      const exists = prev.datos_a_capturar.includes(value);
      return {
        ...prev,
        datos_a_capturar: exists
          ? prev.datos_a_capturar.filter((item) => item !== value)
          : [...prev.datos_a_capturar, value],
      };
    });
  }

  async function handleSubmit() {
    setSending(true);
    setError("");
    try {
      const briefingJson = toPrettyJson(form);
      const payload = {
        nombre: form.nombre_contacto,
        email: form.email,
        telefono: form.telefono,
        mensaje: "Solicitud de chatbot personalizado",
        mensaje_original: briefingJson,
        solucion: "chatbots",
        origen: "briefing_chatbot",
        enviar_email_usuario: false,
        enviar_email_admin: true,
        seguimiento: "pendiente",
        tipo_seguimiento: "email",
        observaciones_internas: briefingJson,
      };

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? "No se pudo enviar el briefing.");
      }

      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo enviar el briefing.");
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <section className="rounded-3xl border border-rebo-subtle bg-white p-8 text-center shadow-sm">
        <h2 className="text-2xl font-bold text-rebo-ink">Perfecto. Hemos recibido tu briefing.</h2>
        <p className="mt-3 text-rebo-muted">
          En breve te preparamos una propuesta personalizada.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-2xl bg-rebo-primary px-8 py-4 text-base font-bold text-white shadow-lg shadow-rebo-primary/25 transition hover:bg-[#159a94]"
        >
          Volver a inicio
        </Link>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <Stepper steps={steps} currentStep={step} />

      {step === 0 ? (
        <FormStep title="Empresa" description="Cuéntanos quién eres y cómo contactarte.">
          <div className="grid gap-4 sm:grid-cols-2">
            <input className={inputClass} placeholder="Nombre de empresa" value={form.nombre_empresa} onChange={(e) => updateField("nombre_empresa", e.target.value)} />
            <input className={inputClass} placeholder="Nombre de contacto" value={form.nombre_contacto} onChange={(e) => updateField("nombre_contacto", e.target.value)} />
            <input className={inputClass} placeholder="Email" type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} />
            <input className={inputClass} placeholder="Teléfono" value={form.telefono} onChange={(e) => updateField("telefono", e.target.value)} />
            <input className={inputClass} placeholder="Web" value={form.web} onChange={(e) => updateField("web", e.target.value)} />
            <input className={inputClass} placeholder="Sector" value={form.sector} onChange={(e) => updateField("sector", e.target.value)} />
          </div>
        </FormStep>
      ) : null}

      {step === 1 ? (
        <FormStep title="Negocio" description="Define contexto para que el chatbot suene a tu marca.">
          <textarea className={inputClass} rows={4} placeholder="Descripción del negocio" value={form.descripcion_negocio} onChange={(e) => updateField("descripcion_negocio", e.target.value)} />
          <textarea className={inputClass} rows={4} placeholder="Servicios" value={form.servicios} onChange={(e) => updateField("servicios", e.target.value)} />
          <textarea className={inputClass} rows={4} placeholder="Cliente ideal" value={form.cliente_ideal} onChange={(e) => updateField("cliente_ideal", e.target.value)} />
          <textarea className={inputClass} rows={4} placeholder="Propuesta de valor" value={form.propuesta_valor} onChange={(e) => updateField("propuesta_valor", e.target.value)} />
          <select className={inputClass} value={form.tono_marca} onChange={(e) => updateField("tono_marca", e.target.value as ChatbotBriefing["tono_marca"])}>
            <option value="formal">Formal</option>
            <option value="cercano">Cercano</option>
            <option value="premium">Premium</option>
            <option value="tecnico">Técnico</option>
            <option value="otro">Otro</option>
          </select>
        </FormStep>
      ) : null}

      {step === 2 ? (
        <FormStep title="Objetivo del chatbot" description="Qué debe conseguir y dónde actuará.">
          <select className={inputClass} value={form.objetivo_principal} onChange={(e) => updateField("objetivo_principal", e.target.value as ChatbotBriefing["objetivo_principal"])}>
            <option value="leads">Leads</option>
            <option value="ventas">Ventas</option>
            <option value="soporte">Soporte</option>
            <option value="reservas">Reservas</option>
            <option value="otro">Otro</option>
          </select>
          <select className={inputClass} value={form.canal} onChange={(e) => updateField("canal", e.target.value as ChatbotBriefing["canal"])}>
            <option value="web">Web</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="ambos">Ambos</option>
          </select>
          <textarea className={inputClass} rows={4} placeholder="¿Qué acción final quieres que haga el usuario?" value={form.accion_final} onChange={(e) => updateField("accion_final", e.target.value)} />
          <label className="inline-flex items-center gap-2 text-sm text-rebo-ink">
            <input type="checkbox" checked={form.derivacion_humano} onChange={(e) => updateField("derivacion_humano", e.target.checked)} />
            Derivación a humano
          </label>
        </FormStep>
      ) : null}

      {step === 3 ? (
        <FormStep title="FAQ y objeciones" description="Añade preguntas y respuestas clave para entrenar al asistente.">
          <div>
            <p className="mb-2 text-sm font-semibold text-rebo-ink">FAQs</p>
            {form.faqs.map((faq, idx) => (
              <div key={`faq-${idx}`} className="mb-3 grid gap-3 sm:grid-cols-2">
                <input className={inputClass} placeholder="Pregunta" value={faq.pregunta} onChange={(e) => {
                  const next = [...form.faqs];
                  next[idx] = { ...next[idx], pregunta: e.target.value };
                  updateField("faqs", next);
                }} />
                <input className={inputClass} placeholder="Respuesta" value={faq.respuesta} onChange={(e) => {
                  const next = [...form.faqs];
                  next[idx] = { ...next[idx], respuesta: e.target.value };
                  updateField("faqs", next);
                }} />
              </div>
            ))}
            <button type="button" className="text-sm font-semibold text-rebo-primary" onClick={() => updateField("faqs", [...form.faqs, { pregunta: "", respuesta: "" }])}>
              + Añadir FAQ
            </button>
          </div>

          <div className="pt-4">
            <p className="mb-2 text-sm font-semibold text-rebo-ink">Objeciones</p>
            {form.objeciones.map((item, idx) => (
              <div key={`obj-${idx}`} className="mb-3 grid gap-3 sm:grid-cols-2">
                <input className={inputClass} placeholder="Objeción" value={item.objecion} onChange={(e) => {
                  const next = [...form.objeciones];
                  next[idx] = { ...next[idx], objecion: e.target.value };
                  updateField("objeciones", next);
                }} />
                <input className={inputClass} placeholder="Respuesta" value={item.respuesta} onChange={(e) => {
                  const next = [...form.objeciones];
                  next[idx] = { ...next[idx], respuesta: e.target.value };
                  updateField("objeciones", next);
                }} />
              </div>
            ))}
            <button type="button" className="text-sm font-semibold text-rebo-primary" onClick={() => updateField("objeciones", [...form.objeciones, { objecion: "", respuesta: "" }])}>
              + Añadir objeción
            </button>
          </div>
        </FormStep>
      ) : null}

      {step === 4 ? (
        <FormStep title="Captura de leads" description="Define cómo y cuándo capturar datos.">
          <div className="grid gap-2 sm:grid-cols-2">
            {(["nombre", "email", "telefono", "empresa", "necesidad"] as DatoCapturar[]).map((item) => (
              <label key={item} className="inline-flex items-center gap-2 rounded-xl border border-rebo-subtle px-3 py-2 text-sm">
                <input type="checkbox" checked={form.datos_a_capturar.includes(item)} onChange={() => toggleDato(item)} />
                {item}
              </label>
            ))}
          </div>
          <select className={inputClass} value={form.momento_captura} onChange={(e) => updateField("momento_captura", e.target.value as MomentoCaptura)}>
            <option value="inicio">Inicio</option>
            <option value="durante">Durante</option>
            <option value="final">Final</option>
            <option value="al_detectar_interes">Al detectar interés</option>
          </select>
          <textarea className={inputClass} rows={4} placeholder="¿Qué consideras un lead caliente?" value={form.que_es_lead_caliente} onChange={(e) => updateField("que_es_lead_caliente", e.target.value)} />
        </FormStep>
      ) : null}

      {step === 5 ? (
        <FormStep title="Personalidad del asistente" description="Marca voz, estilo y límites del chatbot.">
          <input className={inputClass} placeholder="Cómo se presenta" value={form.como_se_presenta} onChange={(e) => updateField("como_se_presenta", e.target.value)} />
          <select className={inputClass} value={form.estilo_asistente} onChange={(e) => updateField("estilo_asistente", e.target.value as ChatbotBriefing["estilo_asistente"])}>
            <option value="asesor">Asesor</option>
            <option value="vendedor">Vendedor</option>
            <option value="soporte">Soporte</option>
            <option value="experto">Experto</option>
          </select>
          <textarea className={inputClass} rows={4} placeholder="Qué evitar" value={form.que_evitar} onChange={(e) => updateField("que_evitar", e.target.value)} />
          <textarea className={inputClass} rows={4} placeholder="Palabras clave" value={form.palabras_clave} onChange={(e) => updateField("palabras_clave", e.target.value)} />
        </FormStep>
      ) : null}

      {step === 6 ? (
        <FormStep title="Revisión y envío" description="Revisa el briefing y envíalo.">
          <textarea className={inputClass} rows={5} placeholder="Información extra" value={form.informacion_extra} onChange={(e) => updateField("informacion_extra", e.target.value)} />
          <div className="rounded-2xl border border-rebo-subtle bg-rebo-bg/40 p-4">
            <p className="mb-2 text-sm font-semibold text-rebo-ink">Resumen</p>
            <pre className="max-h-64 overflow-auto whitespace-pre-wrap text-xs text-rebo-muted">
              {JSON.stringify(form, null, 2)}
            </pre>
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
        </FormStep>
      ) : null}

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setStep((prev) => Math.max(0, prev - 1))}
          disabled={step === 0 || sending}
          className="rounded-xl border border-rebo-subtle bg-white px-5 py-3 text-sm font-semibold text-rebo-ink disabled:cursor-not-allowed disabled:opacity-50"
        >
          Anterior
        </button>

        {step < steps.length - 1 ? (
          <button
            type="button"
            onClick={() => setStep((prev) => Math.min(steps.length - 1, prev + 1))}
            disabled={!canContinue || sending}
            className="rounded-xl bg-rebo-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-rebo-primary/25 transition hover:bg-[#159a94] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Siguiente
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={sending}
            className="rounded-xl bg-rebo-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-rebo-primary/25 transition hover:bg-[#159a94] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {sending ? "Enviando..." : "Enviar briefing"}
          </button>
        )}
      </div>
    </div>
  );
}

