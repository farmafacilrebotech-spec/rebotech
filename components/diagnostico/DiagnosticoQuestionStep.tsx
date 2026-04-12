"use client";

import type { DiagnosticoOption, DiagnosticoQuestion } from "@/lib/diagnostico";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  question: DiagnosticoQuestion;
  selectedId: string | null;
  onSelect: (option: DiagnosticoOption) => void;
  onBack: () => void;
  onNext: () => void;
  canGoBack: boolean;
  isLast: boolean;
};

export function DiagnosticoQuestionStep({
  question,
  selectedId,
  onSelect,
  onBack,
  onNext,
  canGoBack,
  isLast,
}: Props) {
  const canAdvance = selectedId !== null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question.id}
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -24 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col"
      >
        <h2
          id={`diagnostico-q-${question.id}`}
          className="text-xl font-bold leading-snug tracking-tight text-white sm:text-2xl"
        >
          {question.text}
        </h2>
        <p className="mt-2 text-sm text-white/45">Elige la opción que mejor describe tu situación hoy.</p>

        <ul className="mt-8 space-y-3" role="radiogroup" aria-labelledby={`diagnostico-q-${question.id}`}>
          {question.options.map((opt) => {
            const checked = selectedId === opt.id;
            return (
              <li key={opt.id}>
                <label
                  className={`group flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-4 transition-colors focus-within:ring-2 focus-within:ring-[#4ed3c2]/40 focus-within:ring-offset-2 focus-within:ring-offset-[#05080c] sm:px-5 sm:py-4 ${
                    checked
                      ? "border-[#4ed3c2]/70 bg-[#4ed3c2]/[0.12] shadow-[0_0_0_1px_rgba(78,211,194,0.25)]"
                      : "border-white/[0.1] bg-white/[0.03] hover:border-white/[0.18] hover:bg-white/[0.05]"
                  }`}
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-white/25 transition-colors group-hover:border-[#4ed3c2]/50">
                    <span
                      className={`h-2.5 w-2.5 rounded-full transition-transform ${
                        checked ? "scale-100 bg-[#4ed3c2]" : "scale-0 bg-[#4ed3c2]"
                      }`}
                    />
                  </span>
                  <input
                    type="radio"
                    name={question.id}
                    value={opt.id}
                    checked={checked}
                    onChange={() => onSelect(opt)}
                    className="sr-only"
                  />
                  <span className="text-left text-sm font-medium leading-relaxed text-white/90 sm:text-base">
                    {opt.label}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>

        <div className="mt-10 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={onBack}
            disabled={!canGoBack}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 px-6 py-3.5 text-sm font-semibold text-white/80 transition hover:border-white/25 hover:bg-white/[0.05] disabled:pointer-events-none disabled:opacity-35"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
            Anterior
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={!canAdvance}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#4ed3c2] px-8 py-3.5 text-sm font-bold text-[#05080c] shadow-[0_12px_40px_-12px_rgba(78,211,194,0.55)] transition hover:bg-[#6bdfd0] disabled:pointer-events-none disabled:opacity-40"
          >
            {isLast ? "Ver resultado" : "Siguiente"}
            <ChevronRight className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
