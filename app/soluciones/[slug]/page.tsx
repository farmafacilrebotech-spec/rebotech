import { SiteChrome } from "@/components/layout/SiteChrome";
import { SolutionPageView } from "@/components/solutions/SolutionPage";
import {
  getSolutionBySlug,
  isValidSolutionSlug,
  solutionSlugs,
} from "@/lib/solutions";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return solutionSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const s = getSolutionBySlug(slug);
  if (!s) return { title: "Solución" };
  return {
    title: s.seoTitle,
    description: s.seoDescription,
    openGraph: {
      title: `${s.name} | ReBoTech Solutions`,
      description: s.seoDescription,
    },
  };
}

export default async function SolucionDetallePage({ params }: Props) {
  const { slug } = await params;
  if (!isValidSolutionSlug(slug)) notFound();
  const solution = getSolutionBySlug(slug)!;

  return (
    <SiteChrome>
      <SolutionPageView solution={solution} />
    </SiteChrome>
  );
}
