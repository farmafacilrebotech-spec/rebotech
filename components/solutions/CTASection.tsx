import Link from "next/link";
import { PrimaryLeadCTA } from "@/components/leads/LeadModalProvider";

export function CTASection({
  title,
  subtitle,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
  variant = "solid",
  /** Si se indica, el CTA principal abre el modal de leads con esta solución. */
  openLeadForSolution,
}: {
  title: string;
  subtitle?: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  variant?: "solid" | "outline";
  openLeadForSolution?: string;
}) {
  return (
    <section
      className="rounded-3xl border border-rebo-subtle bg-white px-6 py-14 shadow-[0_20px_50px_-24px_rgba(29,28,28,0.12)] sm:px-10 sm:py-16"
      aria-labelledby="cta-block-title"
    >
      <div className="mx-auto max-w-2xl text-center">
        <h2 id="cta-block-title" className="text-2xl font-bold tracking-tight text-rebo-ink sm:text-3xl">
          {title}
        </h2>
        {subtitle ? <p className="mt-4 text-rebo-muted">{subtitle}</p> : null}
        <div className="mt-10 flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center">
          <PrimaryLeadCTA
            solutionName={openLeadForSolution}
            href={primaryHref}
            label={primaryLabel}
            variant={variant}
          />
          {secondaryLabel && secondaryHref ? (
            <Link
              href={secondaryHref}
              className="inline-flex items-center justify-center rounded-2xl border border-rebo-subtle bg-rebo-bg px-8 py-4 text-base font-semibold text-rebo-ink transition hover:border-rebo-primary/30 hover:bg-white"
            >
              {secondaryLabel}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
