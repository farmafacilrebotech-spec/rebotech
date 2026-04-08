import Link from "next/link";

export function CTASection({
  title,
  subtitle,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
  variant = "solid",
}: {
  title: string;
  subtitle?: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  variant?: "solid" | "outline";
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
          <Link
            href={primaryHref}
            className={
              variant === "solid"
                ? "inline-flex items-center justify-center rounded-2xl bg-rebo-primary px-8 py-4 text-base font-bold text-white shadow-lg shadow-rebo-primary/25 transition hover:bg-[#159a94] hover:shadow-xl hover:shadow-rebo-primary/35"
                : "inline-flex items-center justify-center rounded-2xl border-2 border-rebo-primary px-8 py-4 text-base font-bold text-rebo-primary transition hover:bg-rebo-primary/5"
            }
          >
            {primaryLabel}
          </Link>
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
