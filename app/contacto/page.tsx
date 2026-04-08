import { SiteChrome } from "@/components/layout/SiteChrome";
import { ContactForm } from "@/components/landing/ContactForm";
import { buildWhatsappLink } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Contacta con ReBoTech Solutions para una demo, diagnóstico o dudas sobre digitalización, IA y automatización.",
};

export default function ContactoPage() {
  const whatsappUrl = buildWhatsappLink();

  return (
    <SiteChrome>
      <div className="border-b border-rebo-subtle bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-lg text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-rebo-primary">
            Contacto
          </p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-rebo-ink sm:text-4xl">
            Hablemos de tu proyecto
          </h1>
          <p className="mt-4 text-rebo-muted">
            Cuéntanos qué necesitas. Respondemos con propuesta clara y siguiente paso.
          </p>
        </div>
      </div>
      <div className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-lg rounded-3xl border border-rebo-subtle bg-white p-8 shadow-[0_12px_40px_-16px_rgba(29,28,28,0.1)] sm:p-10">
          <ContactForm whatsappUrl={whatsappUrl} />
        </div>
      </div>
    </SiteChrome>
  );
}
