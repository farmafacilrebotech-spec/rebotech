"use client";

import { SolutionCard } from "@/components/solutions/SolutionCard";
import { motion } from "framer-motion";
import Link from "next/link";
import { solutionGroups, solutionsInGroup } from "@/lib/solutions";

export function HomeSolutionsSection() {
  return (
    <section
      id="soluciones"
      className="scroll-mt-20 border-t border-rebo-subtle bg-white px-4 py-24 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-rebo-primary">
            Soluciones
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-rebo-ink sm:text-4xl">
            Tecnología con propósito comercial
          </h2>
          <p className="mt-4 text-rebo-muted">
            Cada bloque agrupa productos listos para vender valor, no solo horas.
          </p>
          <Link
            href="/soluciones"
            className="mt-6 inline-flex text-sm font-bold text-rebo-primary underline-offset-4 hover:underline"
          >
            Ver catálogo completo
          </Link>
        </motion.div>

        <div className="mt-16 space-y-20">
          {solutionGroups.map((group) => {
            const items = solutionsInGroup(group.id);
            return (
              <div key={group.id}>
                <div className="mb-8 max-w-2xl">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-rebo-primary">
                    {group.title}
                  </p>
                  <p className="mt-2 text-sm text-rebo-muted">{group.description}</p>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((s) => (
                    <SolutionCard
                      key={s.slug}
                      slug={s.slug}
                      name={s.name}
                      description={s.description}
                      iconId={s.iconId}
                      cardClass={s.cardClass}
                      featured={s.featured}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
