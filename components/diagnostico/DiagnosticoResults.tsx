"use client";

import { useLeadModal } from "@/components/leads/LeadModalProvider";
import type { DiagnosticoResultPayload } from "@/lib/diagnostico";
import { RECOMMENDATION_CATALOG, levelLabel } from "@/lib/diagnostico";
import type { DiagnosticoLeadData } from "./DiagnosticoLeadForm";
import { motion } from "framer-motion";
import { ArrowRight, ClipboardList, Sparkles } from "lucide-react";
import { useCallback } from "react";

type Props = {
  payload: DiagnosticoResultPayload;
  leadData: DiagnosticoLeadData;
  resumen: string;
  onRestart: () => void;
};

export function DiagnosticoResults({ payload, leadData, resumen, onRestart }: Props) {
  const { open } = useLeadModal();

  const openLead = useCallback(() => {
    open({
      id: "implementacion",
      name: "Implementación",
      prefill: {
        nombre: leadData.nombre.trim(),
        email: leadData.email.trim(),
        telefono: leadData.telefono.trim(),
        mensaje: resumen,
      },
      diagnostico: {
        score: payload.score,
        nivel: payload.level,
      },
    });
  }, [open, leadData, resumen, payload.score, payload.level]);

  const orderedRecs = payload.recommendationIds
    .map((id) => RECOMMENDATION_CATALOG.find((r) => r.id === id))
    .filter(Boolean) as (typeof RECOMMENDATION_CATALOG)[number][];

  const levelColor =
    payload.level === "bajo"
      ? "text-amber-300"
      : payload.level === "medio"
        ? "text-[#4ed3c2]"
        : "text-emerald-300";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col"
    >
      <div className="flex items-center gap-2 text-[#4ed3c2]">
        <Sparkles className="h-5 w-5 shrink-0" aria-hidden />
        <span className="text-xs font-bold uppercase tracking-[0.2em]">Resultado</span>
      </div>

      <h2 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">
        Tu nivel de digitalización
      </h2>

      <div className="mt-8 rounded-3xl border border-white/[0.1] bg-white/[0.04] p-6 sm:p-8">
        <div className="flex flex-wrap items-end gap-4">
          <p className={`text-5xl font-black tabular-nums sm:text-6xl ${levelColor}`}>
            {payload.score}
            <span className="text-lg font-semibold text-white/35 sm:text-xl">/{payload.maxScore}</span>
          </p>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-white/45">Nivel</p>
            <p className={`text-xl font-bold ${levelColor}`}>{levelLabel(payload.level)}</p>
          </div>
        </div>
        <p className="mt-6 text-lg font-semibold leading-snug text-white sm:text-xl">{payload.headline}</p>
      </div>

      <div className="mt-8">
        <div className="mb-4 flex items-center gap-2 text-white/70">
          <ClipboardList className="h-4 w-4" aria-hidden />
          <h3 className="text-sm font-bold uppercase tracking-wider">Principales puntos de mejora</h3>
        </div>
        <ul className="space-y-3">
          {payload.improvementPoints.map((line, i) => (
            <li
              key={i}
              className="flex gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm leading-relaxed text-white/80"
            >
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#4ed3c2]/20 text-xs font-bold text-[#4ed3c2]">
                {i + 1}
              </span>
              {line}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-10">
        <h3 className="text-sm font-bold uppercase tracking-wider text-white/70">Recomendaciones</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {orderedRecs.map((rec, i) => (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i, duration: 0.35 }}
              className="rounded-2xl border border-white/[0.1] bg-gradient-to-br from-white/[0.06] to-transparent p-5"
            >
              <p className="font-bold text-[#4ed3c2]">{rec.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-white/65">{rec.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={openLead}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#4ed3c2] px-8 py-4 text-base font-bold text-[#05080c] shadow-[0_16px_48px_-12px_rgba(78,211,194,0.5)] transition hover:bg-[#6bdfd0]"
        >
          Solicitar implementación
          <ArrowRight className="h-5 w-5" aria-hidden />
        </button>
        <button
          type="button"
          onClick={onRestart}
          className="text-sm font-semibold text-white/50 underline-offset-4 transition hover:text-white/80 hover:underline"
        >
          Volver a hacer el diagnóstico
        </button>
      </div>

      <p className="mt-8 text-center text-xs text-white/35">
        Al pulsar «Solicitar implementación» se abrirá el formulario con tus datos y el resumen ya rellenos: solo
        confirma con Enviar. El resultado sigue guardado en tu navegador por si lo necesitas.
      </p>
    </motion.div>
  );
}
