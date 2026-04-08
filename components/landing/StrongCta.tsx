"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function StrongCta() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.55 }}
        className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl bg-gradient-to-br from-rebo-primary/88 via-rebo-turquoise/72 to-white px-8 py-16 text-center shadow-[0_28px_64px_-24px_rgba(26,187,179,0.38)] sm:px-12 sm:py-20"
      >
        {/* Gradiente animado muy sutil */}
        <motion.div
          className="pointer-events-none absolute -inset-[40%] opacity-40"
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          style={{
            backgroundImage:
              "linear-gradient(110deg, transparent 0%, rgba(255,255,255,0.22) 25%, transparent 50%, rgba(78,211,194,0.35) 75%, transparent 100%)",
            backgroundSize: "200% 200%",
          }}
          aria-hidden
        />
        <motion.div
          className="pointer-events-none absolute inset-0"
          animate={{ opacity: [0.75, 1, 0.75] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background:
              "radial-gradient(circle at 20% 25%, rgba(255,255,255,0.55) 0%, transparent 42%), radial-gradient(circle at 85% 75%, rgba(78,211,194,0.4) 0%, transparent 38%)",
          }}
          aria-hidden
        />
        <motion.div
          className="pointer-events-none absolute -right-20 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-white/25 blur-2xl"
          animate={{ scale: [1, 1.15, 1], x: [0, -10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden
        />
        <div className="relative">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
            ¿Quieres llevar tu negocio al siguiente nivel?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-white/95 sm:text-base">
            Un diagnóstico sin compromiso para ver encaje y próximos pasos.
          </p>
          <motion.div
            className="mt-12 inline-block"
            whileHover={{ scale: 1.06, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 380, damping: 22 }}
          >
            <Link
              href="/contacto"
              className="inline-flex items-center gap-3 rounded-2xl bg-white px-14 py-5 text-lg font-bold text-rebo-primary shadow-xl shadow-black/10 ring-4 ring-white/35 transition-[box-shadow,ring-color] duration-300 hover:ring-white/60 hover:shadow-2xl hover:shadow-black/15"
            >
              Solicitar diagnóstico gratuito
              <ArrowRight className="h-6 w-6" aria-hidden />
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
