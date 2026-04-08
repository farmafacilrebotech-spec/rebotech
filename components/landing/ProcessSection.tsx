"use client";

import { motion } from "framer-motion";
import { ClipboardList, Lightbulb, Rocket, Workflow } from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    title: "Analizamos tu negocio",
    short: "Escuchamos cómo trabajáis hoy.",
  },
  {
    icon: Lightbulb,
    title: "Detectamos oportunidades",
    short: "Priorizamos lo que más impacto tiene.",
  },
  {
    icon: Rocket,
    title: "Implementamos soluciones",
    short: "Construimos y acompañamos en el arranque.",
  },
  {
    icon: Workflow,
    title: "Automatizamos procesos",
    short: "Dejamos todo funcionando sin fricción.",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24, scale: 0.94 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function ProcessSection() {
  return (
    <section
      id="proceso"
      className="scroll-mt-20 border-t border-slate-100 bg-rebo-subtle/50 px-4 py-24 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rebo-primary">
            Proceso
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-rebo-ink sm:text-4xl">
            Cómo trabajamos
          </h2>
        </motion.div>

        <div className="mt-16 hidden lg:block">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="relative flex items-start justify-between gap-4"
          >
            <div
              className="absolute left-[10%] right-[10%] top-10 h-0.5 bg-gradient-to-r from-transparent via-rebo-turquoise/45 to-transparent"
              aria-hidden
            />
            {steps.map((step) => (
              <motion.div
                key={step.title}
                variants={item}
                className="relative flex w-1/4 flex-col items-center text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.08, rotate: [0, -2, 2, 0] }}
                  transition={{ duration: 0.4 }}
                  className="relative z-10 flex h-[5rem] w-[5rem] items-center justify-center rounded-2xl bg-gradient-to-br from-white to-rebo-bg text-rebo-primary shadow-lg shadow-rebo-primary/14 ring-2 ring-rebo-primary/12"
                >
                  <step.icon className="h-10 w-10" strokeWidth={1.65} aria-hidden />
                </motion.div>
                <p className="mt-6 text-sm font-bold text-rebo-ink">{step.title}</p>
                <p className="mt-2 max-w-[11rem] text-xs leading-relaxed text-rebo-muted">
                  {step.short}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.ol
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          className="mt-12 space-y-5 lg:hidden"
        >
          {steps.map((step, i) => (
            <motion.li
              key={step.title}
              variants={item}
              className="flex gap-5 rounded-2xl border border-slate-100 bg-white p-6 shadow-md shadow-slate-200/40"
            >
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-rebo-primary/12 to-rebo-turquoise/20 text-lg font-bold text-rebo-primary shadow-sm">
                {i + 1}
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <step.icon className="h-7 w-7 shrink-0 text-rebo-primary" strokeWidth={1.65} />
                  <h3 className="font-bold text-rebo-ink">{step.title}</h3>
                </div>
                <p className="mt-2 text-sm text-rebo-muted">{step.short}</p>
              </div>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}
