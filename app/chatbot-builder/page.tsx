import { SiteChrome } from "@/components/layout/SiteChrome";
import { ChatbotBuilderForm } from "@/components/chatbot-builder/ChatbotBuilderForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chatbot Builder",
  description: "Briefing paso a paso para solicitar un chatbot personalizado de ReBoTech.",
};

export default function ChatbotBuilderPage() {
  return (
    <SiteChrome>
      <section className="border-b border-rebo-subtle bg-white px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-rebo-primary">
            Chatbot personalizado
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-rebo-ink sm:text-5xl">
            Diseña tu chatbot con nosotros
          </h1>
          <p className="mt-5 text-lg text-rebo-muted">
            Completa este briefing y te prepararemos una propuesta a medida para tu negocio.
          </p>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <ChatbotBuilderForm />
        </div>
      </section>
    </SiteChrome>
  );
}

