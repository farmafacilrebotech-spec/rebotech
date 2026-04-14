import type { SolutionPageModel } from "@/lib/solutions";
import { getSolutionCardHtmlPath } from "@/lib/solutionMockup";
import { PrimaryLeadCTA } from "@/components/leads/LeadModalProvider";
import Link from "next/link";
import { CTASection } from "./CTASection";
import { FeatureList } from "./FeatureList";
import { SectionTitle } from "./SectionTitle";

export function SolutionPageView({ solution }: { solution: SolutionPageModel }) {
  return (
    <article>
      <section
        className="border-b border-rebo-subtle bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
        aria-labelledby="solution-hero-title"
      >
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-rebo-primary">
            Solución
          </p>
          <h1
            id="solution-hero-title"
            className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-rebo-ink sm:text-5xl"
          >
            {solution.hero.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-rebo-muted">
            {solution.hero.subtitle}
          </p>
          <div className="mt-10">
            <PrimaryLeadCTA
              leadSolution={{ id: solution.id, name: solution.name }}
              href={solution.hero.ctaHref}
              label={solution.hero.ctaLabel}
            />
            {solution.slug === "chatbots" ? (
              <Link
                href="/chatbot-builder"
                className="mt-4 inline-flex rounded-2xl border border-rebo-subtle bg-rebo-bg px-8 py-4 text-base font-semibold text-rebo-ink transition hover:border-rebo-primary/30 hover:bg-white"
              >
                Yo quiero el mío
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      <section
        className="px-4 py-16 sm:px-6 lg:px-8"
        aria-labelledby="solution-problem-title"
      >
        <div className="mx-auto max-w-6xl">
          <SectionTitle
            as="h2"
            id="solution-problem-title"
            title={solution.problem.title}
            description={solution.problem.body}
          />
        </div>
      </section>

      <section
        className="border-y border-rebo-subtle bg-white px-4 py-16 sm:px-6 lg:px-8"
        aria-labelledby="solution-steps-title"
      >
        <div className="mx-auto max-w-6xl">
          <SectionTitle
            as="h2"
            eyebrow="Cómo funciona"
            id="solution-steps-title"
            title="Tres pasos claros"
            description="Un recorrido simple para pasar del caos al resultado."
          />
          <ol className="mt-12 grid gap-8 sm:grid-cols-3" role="list">
            {solution.steps.map((step, i) => (
              <li
                key={step.title}
                className="relative rounded-2xl border border-rebo-subtle bg-rebo-bg/50 p-6 shadow-sm"
              >
                <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-rebo-primary text-sm font-bold text-white">
                  {i + 1}
                </span>
                <h3 className="text-lg font-bold text-rebo-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-rebo-muted">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8" aria-labelledby="solution-visual-title">
        <div className="mx-auto max-w-4xl">
          <SectionTitle
            as="h2"
            eyebrow="Producto"
            id="solution-visual-title"
            title="Vista del producto"
            description="Interacción visual del producto en un mockup interactivo."
            align="center"
          />
          <div className="mt-10">
            <div className="solution-mockup-frame">
              <iframe
                src={getSolutionCardHtmlPath(solution.slug)}
                title={`Vista previa — ${solution.name}`}
                className="solution-mockup-iframe"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      <section
        className="border-t border-rebo-subtle bg-white px-4 py-16 sm:px-6 lg:px-8"
        aria-labelledby="solution-usecases-title"
      >
        <div className="mx-auto max-w-6xl lg:grid lg:grid-cols-[1fr_1.1fr] lg:items-start lg:gap-14">
          <SectionTitle
            as="h2"
            id="solution-usecases-title"
            title={solution.useCases.title}
            description="Ejemplos de organizaciones que sacan partido de este tipo de solución."
          />
          <div className="mt-10 lg:mt-0">
            <FeatureList items={solution.useCases.items} />
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <CTASection
            title={solution.finalCta.title}
            subtitle={solution.finalCta.subtitle}
            primaryLabel={solution.finalCta.primaryLabel}
            primaryHref={solution.finalCta.primaryHref}
            leadSolution={{ id: solution.id, name: solution.name }}
            secondaryLabel={solution.finalCta.secondaryLabel}
            secondaryHref={solution.finalCta.secondaryHref}
          />
        </div>
      </section>
    </article>
  );
}
