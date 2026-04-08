import { DifferentialSection } from "@/components/landing/DifferentialSection";
import { Hero } from "@/components/landing/Hero";
import { HomeSolutionsSection } from "@/components/landing/HomeSolutionsSection";
import { ProcessSection } from "@/components/landing/ProcessSection";
import { ServicesSection } from "@/components/landing/ServicesSection";
import { SolutionStorySection } from "@/components/landing/SolutionStorySection";
import { StrongCta } from "@/components/landing/StrongCta";
import { SiteChrome } from "@/components/layout/SiteChrome";
import type { Metadata } from "next";

export const metadata: Metadata = {
  description:
    "ReBoTech Solutions: digitalización, IA, automatización y productos tecnológicos para pymes. Diagnóstico sin compromiso.",
};

export default function Home() {
  return (
    <SiteChrome>
      <Hero />
      <SolutionStorySection />
      <ServicesSection />
      <HomeSolutionsSection />
      <ProcessSection />
      <DifferentialSection />
      <StrongCta />
    </SiteChrome>
  );
}
