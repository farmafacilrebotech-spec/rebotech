"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const links = [
  { href: "/#servicios", label: "Servicios" },
  { href: "/#soluciones", label: "Productos" },
  { href: "/#proceso", label: "Cómo trabajamos" },
  { href: "/diagnostico", label: "Diagnóstico" },
  { href: "/contacto", label: "Contacto" },
];

function BrandTitleImage({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/ReBoTech_titulo.png"
      alt="ReBoTech Solutions"
      width={220}
      height={56}
      className={`h-9 w-auto max-w-[min(100%,200px)] object-contain object-left sm:h-10 sm:max-w-[240px] ${className}`}
      priority
    />
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={`sticky top-0 z-50 border-b transition-[background,box-shadow] duration-300 ${
        scrolled
          ? "border-rebo-subtle bg-white/95 shadow-[0_8px_30px_-12px_rgba(26,187,179,0.1)] backdrop-blur-md"
          : "border-transparent bg-white/80 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex h-[4.25rem] max-w-6xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center py-1" aria-label="ReBoTech Solutions — inicio">
          <BrandTitleImage />
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Principal">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-2xl px-3.5 py-2 text-sm font-medium text-rebo-muted transition-colors duration-200 hover:bg-rebo-bg hover:text-rebo-primary"
            >
              {l.label}
            </Link>
          ))}
          <motion.span whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="ml-2">
            <Link
              href="/contacto"
              className="inline-flex rounded-2xl bg-rebo-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-rebo-primary/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#159a94] hover:shadow-lg hover:shadow-rebo-primary/35"
            >
              Diagnóstico
            </Link>
          </motion.span>
        </nav>

        <button
          type="button"
          className="inline-flex rounded-2xl p-2 text-rebo-ink md:hidden"
          aria-expanded={open}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-rebo-subtle bg-white px-4 py-5 shadow-inner md:hidden">
          <div className="mb-4 border-b border-rebo-subtle pb-4">
            <BrandTitleImage className="max-w-full" />
          </div>
          <nav className="flex flex-col gap-1" aria-label="Móvil">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-2xl px-3 py-3 text-base font-medium text-rebo-ink transition-colors hover:bg-rebo-bg"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/contacto"
              className="mt-2 rounded-2xl bg-rebo-primary py-3.5 text-center text-sm font-semibold text-white shadow-md transition hover:bg-[#159a94]"
              onClick={() => setOpen(false)}
            >
              Solicitar diagnóstico
            </Link>
          </nav>
        </div>
      ) : null}
    </motion.header>
  );
}
