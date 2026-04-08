"use client";

import { motion } from "framer-motion";
import { Bot, Cpu, HeartHandshake, LayoutDashboard } from "lucide-react";

const services = [
  {
    icon: Cpu,
    title: "Automatización de procesos",
    line: "Menos tareas repetitivas, más tiempo para lo que importa.",
  },
  {
    icon: Bot,
    title: "Inteligencia artificial",
    line: "Asistentes y flujos inteligentes sin complicarte la vida.",
  },
  {
    icon: HeartHandshake,
    title: "Experiencia de cliente",
    line: "Cada contacto con tu marca, más fluido y memorable.",
  },
  {
    icon: LayoutDashboard,
    title: "Digitalización de negocios",
    line: "Del papel y el caos al orden digital paso a paso.",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export function ServicesSection() {
  return (
    <section
      id="servicios"
      className="scroll-mt-20 border-t border-slate-100 bg-rebo-bg px-4 py-24 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rebo-primary">
            Qué hacemos
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-rebo-ink sm:text-4xl">
            Servicios pensados para resultados
          </h2>
        </motion.div>

        <div className="mt-16 grid gap-7 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {services.map((s, i) => (
            <motion.article
              key={s.title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-40px" }}
              whileHover={{
                y: -8,
                scale: 1.02,
                transition: { duration: 0.25 },
              }}
              className="group flex flex-col rounded-2xl border border-slate-100 bg-white p-9 shadow-[0_4px_24px_-8px_rgba(26,46,46,0.08)] transition-shadow hover:border-rebo-turquoise/40 hover:shadow-[0_24px_48px_-16px_rgba(26,187,179,0.22)]"
            >
              <div className="mb-7 inline-flex h-[5.25rem] w-[5.25rem] items-center justify-center rounded-2xl bg-gradient-to-br from-rebo-primary/16 to-rebo-turquoise/26 text-rebo-primary shadow-inner ring-1 ring-rebo-primary/12 transition-transform duration-300 group-hover:scale-105">
                <s.icon className="h-11 w-11" strokeWidth={1.65} aria-hidden />
              </div>
              <h3 className="text-lg font-bold text-rebo-ink">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-rebo-muted">{s.line}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
