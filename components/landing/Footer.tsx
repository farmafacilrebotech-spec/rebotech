import { BrandWordmark } from "@/components/BrandWordmark";
import { buildWhatsappLink, getSocialSlots } from "@/lib/site";
import { FooterSocialIcons } from "./FooterSocialIcons";
import Image from "next/image";
import Link from "next/link";

const footerLink = "text-sm text-rebo-muted transition hover:text-rebo-primary";

export function Footer() {
  const socialSlots = getSocialSlots();
  const whatsappUrl = buildWhatsappLink();

  return (
    <footer className="border-t border-rebo-subtle bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          <div className="lg:pr-4">
            <BrandWordmark />
            <p className="mt-6 text-sm leading-relaxed text-rebo-muted">
              Tecnología aplicada a negocio: automatización, IA y productos digitales para empresas que
              quieren crecer con orden.
            </p>
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-rebo-ink">Servicios</h2>
            <ul className="mt-5 space-y-3" role="list">
              <li>
                <Link href="/#servicios" className={footerLink}>
                  Qué hacemos
                </Link>
              </li>
              <li>
                <Link href="/#proceso" className={footerLink}>
                  Cómo trabajamos
                </Link>
              </li>
              <li>
                <Link href="/#diferencial" className={footerLink}>
                  Por qué ReBoTech
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-rebo-ink">Productos</h2>
            <ul className="mt-5 space-y-3" role="list">
              <li>
                <Link href="/soluciones" className={footerLink}>
                  Todas las soluciones
                </Link>
              </li>
              <li>
                <Link href="/#soluciones" className={footerLink}>
                  Resumen en inicio
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-rebo-ink">Contacto</h2>
            <ul className="mt-5 space-y-3" role="list">
              <li>
                <Link href="/contacto" className={footerLink}>
                  Formulario
                </Link>
              </li>
              <li>
                <Link href="/contacto" className={`${footerLink} font-semibold text-rebo-primary`}>
                  Solicitar diagnóstico
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <section
          className="mt-14 border-t border-rebo-subtle py-12"
          aria-labelledby="footer-rrss-heading"
        >
          <h2
            id="footer-rrss-heading"
            className="text-center text-xs font-bold uppercase tracking-[0.14em] text-rebo-ink"
          >
            Redes sociales
          </h2>
          <div className="mx-auto mt-6 flex max-w-3xl flex-col items-center gap-6 text-center">
            <div className="w-full">
              <FooterSocialIcons slots={socialSlots} />
              {/*<p className="mt-4 text-xs text-rebo-muted">
                Si aún no has puesto la URL en{" "}
                <code className="rounded bg-rebo-bg px-1 py-0.5 text-[11px] text-rebo-ink">.env</code>, el
                botón te lleva al formulario de contacto. Sustituye{" "}
                <code className="text-[11px]">NEXT_PUBLIC_SOCIAL_*</code> por tus enlaces reales.
              </p>*/}
            </div>
            {whatsappUrl ? (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-fit items-center gap-2 rounded-2xl bg-[#25D366] px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#20bd5a] hover:shadow-lg"
              >
                <WhatsAppGlyph className="h-5 w-5 shrink-0" />
                WhatsApp
              </a>
            ) : null}
            <div className="pt-2">
              <p className="text-sm font-semibold text-rebo-ink">Contacto directo</p>
              <a
                href="mailto:rebotech.solutions@gmail.com"
                className="mt-2 inline-flex items-center gap-2 text-sm text-rebo-muted transition hover:text-rebo-primary"
              >
                <span aria-hidden>📧</span>
                rebotech.solutions@gmail.com
              </a>
            </div>
          </div>
        </section>
      </div>

      <div className="border-t border-rebo-subtle bg-rebo-bg/80 px-4 py-16 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6">
          <Image
            src="/rebotech-logo.png"
            alt=""
            width={320}
            height={104}
            className="h-24 w-auto object-contain opacity-95 sm:h-28"
            aria-hidden
          />
          <p className="text-center text-sm text-rebo-muted">
            © 2026 ReBoTech Solutions. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.881 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
