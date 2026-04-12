"use client";

import { motion } from "framer-motion";

type Props = {
  /** Índice 0-based de la pregunta actual. */
  current: number;
  total: number;
  /** Pantalla previa: barra al 0 % sin numerar como pregunta 1. */
  intro?: boolean;
};

export function DiagnosticoProgress({ current, total, intro = false }: Props) {
  const pct = intro ? 0 : Math.round(((current + 1) / total) * 100);

  return (
    <div className="w-full">
      <div className="mb-2 flex justify-between text-xs font-medium text-white/50">
        <span>
          {intro ? `${total} preguntas` : `Pregunta ${current + 1} de ${total}`}
        </span>
        <span>{pct}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/[0.08]">
        <motion.div
          className="h-full rounded-full bg-[#4ed3c2]"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 200, damping: 26 }}
        />
      </div>
    </div>
  );
}
