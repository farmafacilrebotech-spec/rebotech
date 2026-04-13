import { SiteChrome } from "@/components/layout/SiteChrome";
import { SolutionsGrid } from "@/components/SolutionsGrid";
import { SolutionCard } from "@/components/solutions/SolutionCard";
import type { Metadata } from "next";
import Link from "next/link";
import { siteUrl } from "@/lib/site";
import { allSolutions, solutionGroups, solutionsInGroup } from "@/lib/solutions";

export const metadata: Metadata = {
  title: "Soluciones",
  description:
    "Catálogo de soluciones tecnológicas ReBoTech: digitalización, eventos, torneos, votaciones, QR, tickets y más.",
};

export default function SolucionesPage() {
  return (
    <SiteChrome>
      <div className="border-b border-rebo-subtle bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-rebo-primary">
            Catálogo
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-rebo-ink sm:text-5xl">
            Soluciones que venden por ti
          </h1>
          <p className="mt-6 text-lg text-rebo-muted">
            Productos y sistemas pensados para encajar en operaciones reales. Elige una ficha para ver problema,
            funcionamiento y casos de uso.
          </p>
          <Link
            href="/diagnostico"
            className="mt-10 inline-flex rounded-2xl bg-rebo-primary px-8 py-4 text-base font-bold text-white shadow-lg shadow-rebo-primary/25 transition hover:bg-[#159a94]"
          >
            Solicitar diagnóstico
          </Link>
        </div>
      </div>

      <div className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-20">
          <SolutionsGrid />
          {solutionGroups.map((group) => (
            <section key={group.id} aria-labelledby={`hub-${group.id}`}>
              <h2 id={`hub-${group.id}`} className="text-2xl font-bold text-rebo-ink">
                {group.title}
              </h2>
              <p className="mt-2 max-w-2xl text-rebo-muted">{group.description}</p>
              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {solutionsInGroup(group.id).map((s) => (
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
            </section>
          ))}
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: allSolutions.map((s, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: s.name,
              url: `${siteUrl}/soluciones/${s.slug}`,
            })),
          }),
        }}
      />
    </SiteChrome>
  );
}
