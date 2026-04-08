import type { SolutionSlug } from "./solutions";

/** Ruta del mockup HTML embebido por solución (public/cards). */
export const SOLUTION_CARD_HTML: Record<SolutionSlug, string> = {
  chatbots: "/cards/chatbot.html",
  automatizacion: "/cards/automatizacion.html",
  farmafacil: "/cards/farmafacil.html",
  tickets: "/cards/tickets.html",
  qr: "/cards/qr.html",
  acreditaciones: "/cards/acreditaciones.html",
  torneos: "/cards/padel.html",
  votaciones: "/cards/votaciones.html",
};

export function getSolutionCardHtmlPath(slug: SolutionSlug): string {
  return SOLUTION_CARD_HTML[slug];
}
