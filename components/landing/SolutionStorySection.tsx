"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, MousePointerClick, ScanLine } from "lucide-react";
import { Fragment } from "react";

const steps = [
  {
    icon: ScanLine,
    label: "Escaneo",
    hint: "QR o enlace",
  },
  {
    icon: MousePointerClick,
    label: "Interacción",
    hint: "Flujo guiado",
  },
  {
    icon: CheckCircle2,
    label: "Resultado",
    hint: "Dato útil al instante",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.12 + i * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export function SolutionStorySection() {
  return (
    <section
      className="relative overflow-hidden border-y border-slate-100 bg-gradient-to-b from-white via-rebo-bg/40 to-white px-4 py-20 sm:px-6 lg:px-8"
      aria-labelledby="story-heading"
    >
      <div className="pointer-events-none absolute right-0 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-rebo-turquoise/12 blur-3xl" aria-hidden />
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rebo-primary">
            Flujo típico
          </p>
          <h2 id="story-heading" className="mt-4 text-3xl font-bold tracking-tight text-rebo-ink sm:text-4xl">
            Así funcionan nuestras soluciones
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-rebo-muted">
            Desde un simple código hasta el resultado final: tus clientes interactúan,
            tú recibes orden, datos y menos fricción.
          </p>
        </motion.div>

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:flex-wrap sm:justify-end lg:flex-nowrap">
          {steps.map((step, i) => (
            <Fragment key={step.label}>
              <motion.div
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-20px" }}
                whileHover={{ y: -6, transition: { duration: 0.22 } }}
                className="w-full max-w-[220px] rounded-2xl border border-slate-200/90 bg-white px-6 py-9 text-center shadow-[0_10px_36px_-10px_rgba(26,187,179,0.18)] transition-shadow duration-300 hover:shadow-[0_20px_48px_-14px_rgba(26,187,179,0.28)] sm:w-auto sm:min-w-[148px]"
              >
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-rebo-primary/18 to-rebo-turquoise/28 text-rebo-primary shadow-inner ring-1 ring-rebo-primary/15">
                  <step.icon className="h-8 w-8" strokeWidth={1.5} aria-hidden />
                </span>
                <span className="mt-5 block text-sm font-bold text-rebo-ink">{step.label}</span>
                <span className="mt-1.5 block text-xs font-medium text-rebo-muted">{step.hint}</span>
              </motion.div>
              {i < steps.length - 1 ? (
                <ArrowRight
                  className="h-6 w-6 shrink-0 rotate-90 text-rebo-primary/50 sm:rotate-0"
                  strokeWidth={1.75}
                  aria-hidden
                />
              ) : null}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
