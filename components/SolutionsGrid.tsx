import Link from "next/link";

type SolutionEmbed = {
  key: string;
  title: string;
  src: string;
  href: string;
};

const embeds: SolutionEmbed[] = [
  { key: "chatbot", title: "Chatbot IA", src: "/cards/chatbot.html", href: "/soluciones/chatbots" },
  {
    key: "automatizacion",
    title: "Automatizacion",
    src: "/cards/automatizacion.html",
    href: "/soluciones/automatizacion",
  },
  { key: "farmafacil", title: "FarmaFacil", src: "/cards/farmafacil.html", href: "/soluciones/farmafacil" },
  { key: "tickets", title: "Sistema de tickets", src: "/cards/tickets.html", href: "/soluciones/tickets" },
  {
    key: "acreditaciones",
    title: "Acreditaciones inteligentes",
    src: "/cards/acreditaciones.html",
    href: "/soluciones/acreditaciones",
  },
  { key: "qr", title: "QR dinamico", src: "/cards/qr.html", href: "/soluciones/qr" },
  { key: "padel", title: "Torneos de padel", src: "/cards/padel.html", href: "/soluciones/torneos" },
  {
    key: "votaciones",
    title: "Votaciones automaticas",
    src: "/cards/votaciones.html",
    href: "/soluciones/votaciones",
  },
];

export function SolutionsGrid() {
  return (
    <section aria-labelledby="soluciones-embebidas-title">
      <div className="mb-8">
        <h2 id="soluciones-embebidas-title" className="text-2xl font-bold text-rebo-ink">
          Soluciones
        </h2>
        <p className="mt-2 max-w-2xl text-rebo-muted">
          Vista rapida de productos con identidad visual unificada ReBoTech.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {embeds.map((card) => (
          <Link
            key={card.key}
            href={card.href}
            className="block overflow-hidden rounded-2xl shadow-xl transition duration-300 hover:scale-[1.02]"
            aria-label={`Abrir ${card.title}`}
          >
            <iframe
              src={card.src}
              title={card.title}
              loading="lazy"
              className="pointer-events-none h-[360px] w-full border-0"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
