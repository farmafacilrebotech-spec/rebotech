import { DiagnosticoClient } from "@/components/diagnostico/DiagnosticoClient";
import { SiteChrome } from "@/components/layout/SiteChrome";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Diagnóstico digital",
  description:
    "Evalúa en minutos el nivel de digitalización de tu negocio. Recomendaciones de automatización, integración e IA. ReBoTech Solutions.",
  openGraph: {
    title: "Diagnóstico digital | ReBoTech Solutions",
    description:
      "Diez preguntas para medir madurez digital y recibir un plan de mejora orientado a resultados.",
  },
};

export default function DiagnosticoPage() {
  return (
    <SiteChrome>
      <DiagnosticoClient />
    </SiteChrome>
  );
}
