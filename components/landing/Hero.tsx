"use client";

import { MockupContainer } from "@/components/solutions/MockupContainer";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const floatTransition = {
  duration: 5,
  repeat: Infinity,
  repeatType: "reverse" as const,
  ease: "easeInOut" as const,
};

const textEase = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white px-4 pb-24 pt-16 sm:px-6 sm:pb-32 sm:pt-20 lg:px-8">
      <motion.div
        className="pointer-events-none absolute -left-24 top-20 h-80 w-80 rounded-full bg-rebo-turquoise/20 blur-3xl"
        animate={{ x: [0, 22, 0], y: [0, -14, 0] }}
        transition={floatTransition}
        aria-hidden
      />
      <motion.div
        className="pointer-events-none absolute -right-20 top-32 h-72 w-72 rounded-full bg-rebo-primary/18 blur-3xl"
        animate={{ x: [0, -18, 0], y: [0, 18, 0] }}
        transition={{ ...floatTransition, duration: 6 }}
        aria-hidden
      />
      <motion.div
        className="pointer-events-none absolute bottom-16 left-1/4 h-56 w-56 rounded-full bg-rebo-turquoise/14 blur-2xl"
        animate={{ scale: [1, 1.1, 1], opacity: [0.45, 0.7, 0.45] }}
        transition={{ ...floatTransition, duration: 7 }}
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-12">
        <div className="text-center lg:text-left">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: textEase }}
            className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-rebo-primary"
          >
            ReBoTech Solutions
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05, ease: textEase }}
            className="text-balance text-4xl font-bold tracking-tight text-rebo-ink sm:text-5xl lg:text-[3.15rem] lg:leading-[1.12]"
          >
            Digitalizamos tu negocio de forma{" "}
            <span className="bg-gradient-to-r from-rebo-primary to-rebo-turquoise bg-clip-text text-transparent">
              simple y efectiva
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12, ease: textEase }}
            className="mx-auto mt-7 max-w-xl text-lg leading-relaxed text-rebo-muted sm:text-xl lg:mx-0"
          >
            Automatización, inteligencia artificial y soluciones reales para
            empresas que quieren crecer.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: textEase }}
            className="mt-11 flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:justify-center lg:justify-start"
          >
            <motion.div
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
            >
              <Link
                href="/contacto"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-rebo-primary px-8 py-4 text-base font-semibold text-white shadow-lg shadow-rebo-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-rebo-primary/45 sm:w-auto"
              >
                Solicitar diagnóstico
                <ArrowRight className="h-5 w-5" aria-hidden />
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
            >
              <Link
                href="/#soluciones"
                className="inline-flex w-full items-center justify-center rounded-2xl border border-rebo-subtle bg-white px-8 py-4 text-base font-semibold text-rebo-ink shadow-sm transition-all duration-300 hover:border-rebo-turquoise/50 hover:bg-rebo-bg hover:shadow-md sm:w-auto"
              >
                Ver soluciones
              </Link>
            </motion.div>
          </motion.div>
        </div>

        <div className="relative lg:pl-4">
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[min(100%,420px)] w-[min(100%,420px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-rebo-turquoise/30 via-rebo-primary/20 to-transparent blur-3xl"
            aria-hidden
          />
          <motion.div
            className="relative mx-auto w-full max-w-md lg:max-w-none"
            initial={{ opacity: 0, x: 36, y: 16 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.div
                className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] bg-rebo-primary/20 blur-3xl"
                animate={{ opacity: [0.45, 0.65, 0.45], scale: [1, 1.04, 1] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                aria-hidden
              />
              <MockupContainer aspect="video" caption="Panel / producto — sustituir por captura real" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
