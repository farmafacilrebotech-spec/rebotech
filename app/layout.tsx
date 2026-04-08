import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ReBoTech Solutions | Digitalización y automatización para pymes",
    template: "%s | ReBoTech Solutions",
  },
  description:
    "Automatización, inteligencia artificial y soluciones digitales para pymes. Productos y sistemas a medida. Solicita diagnóstico gratuito.",
  keywords: [
    "automatización",
    "pymes",
    "inteligencia artificial",
    "digitalización",
    "ReBoTech",
    "software a medida",
  ],
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "ReBoTech Solutions",
    title: "ReBoTech Solutions — Tecnología que vende por ti",
    description:
      "Digitalizamos tu negocio de forma simple y efectiva. Automatización, IA y soluciones reales para empresas que quieren crecer.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ReBoTech Solutions",
    description:
      "Automatización, IA y soluciones digitales para pymes. Diagnóstico gratuito.",
  },
  robots: { index: true, follow: true },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ReBoTech Solutions",
  description:
    "Automatización, inteligencia artificial y soluciones digitales para pymes.",
  url: siteUrl,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${plusJakarta.variable} h-full antialiased`}>
      <body className="min-h-full">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        {children}
      </body>
    </html>
  );
}
