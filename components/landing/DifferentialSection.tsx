"use client";

import { motion } from "framer-motion";
import { Gauge, Handshake, ShieldCheck, Sparkles } from "lucide-react";

const items = [
  {
    icon: ShieldCheck,
    text: "Sin complicaciones técnicas",
    sub: "Hablamos tu idioma, no solo el de los servidores.",
  },
  {
    icon: Gauge,
    text: "Implementación rápida",
    sub: "Priorizamos entregas que puedas usar desde el día uno.",
  },
  {
    icon: Handshake,
    text: "Adaptado a tu negocio",
    sub: "Nada genérico: encaje con tu operación real.",
  },
  {
    icon: Sparkles,
    text: "Resultados reales",
    sub: "Métricas y tranquilidad, no solo pantallas bonitas.",
  },
];

export function DifferentialSection() {
  return (
    <section
      id="diferencial"
      className="scroll-mt-20 bg-white px-4 py-24 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rebo-primary">
            Por qué ReBoTech
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-rebo-ink sm:text-4xl">
            Claro, cercano y efectivo
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-rebo-muted">
            Confianza y claridad en cada fase del proyecto.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {items.map((item, i) => (
            <motion.div
              key={item.text}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              whileHover={{ y: -6, scale: 1.01, transition: { duration: 0.2 } }}
              className="flex gap-5 rounded-2xl border border-slate-100 bg-gradient-to-br from-white to-rebo-bg/60 p-7 shadow-[0_8px_30px_-12px_rgba(26,46,46,0.06)] transition-shadow hover:shadow-[0_20px_40px_-16px_rgba(26,187,179,0.12)]"
            >
              <span className="flex h-[4.5rem] w-[4.5rem] shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-rebo-primary/18 to-rebo-turquoise/28 text-rebo-primary shadow-md ring-1 ring-rebo-primary/12">
                <item.icon className="h-9 w-9" strokeWidth={1.65} aria-hidden />
              </span>
              <div>
                <span className="text-lg font-bold text-rebo-ink">{item.text}</span>
                <p className="mt-2 text-sm leading-relaxed text-rebo-muted">{item.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
