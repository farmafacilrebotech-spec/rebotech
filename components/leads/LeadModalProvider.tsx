"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useState,
} from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

type LeadModalContextValue = {
  open: (solucion: string) => void;
  close: () => void;
};

const LeadModalContext = createContext<LeadModalContextValue | null>(null);

export function useLeadModal() {
  const ctx = useContext(LeadModalContext);
  if (!ctx) {
    throw new Error("useLeadModal debe usarse dentro de LeadModalProvider");
  }
  return ctx;
}

type Status = "idle" | "loading" | "success" | "error";

export function LeadModalProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [solucion, setSolucion] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const titleId = useId();

  const close = useCallback(() => {
    setVisible(false);
    setStatus("idle");
    setErrorMsg("");
  }, []);

  const open = useCallback((name: string) => {
    setSolucion(name);
    setVisible(true);
    setStatus("idle");
    setErrorMsg("");
  }, []);

  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible, close]);

  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [visible]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      solucion,
      nombre: String(fd.get("nombre") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      telefono: String(fd.get("telefono") ?? "").trim(),
      mensaje: String(fd.get("mensaje") ?? "").trim(),
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { error?: string };

      if (!res.ok) {
        setErrorMsg(data.error ?? "No se pudo enviar. Inténtalo de nuevo.");
        setStatus("error");
        return;
      }

      setStatus("success");
      form.reset();
      window.setTimeout(() => {
        close();
      }, 1600);
    } catch {
      setErrorMsg("No hay conexión. Inténtalo de nuevo.");
      setStatus("error");
    }
  }

  return (
    <LeadModalContext.Provider value={{ open, close }}>
      {children}
      {visible ? (
        <div
          className="lead-modal"
          role="presentation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="lead-box"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <h3 id={titleId} className="text-lg font-bold text-white">
                Solicitar diagnóstico
              </h3>
              <button
                type="button"
                onClick={close}
                className="rounded-lg px-2 py-1 text-sm text-white/60 transition hover:bg-white/10 hover:text-white"
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>
            <p className="mb-4 text-sm text-white/55">
              Solución: <span className="font-semibold text-rebo-turquoise">{solucion}</span>
            </p>

            <form onSubmit={handleSubmit} className="lead-form space-y-3">
              <input type="hidden" name="solucion" value={solucion} readOnly />
              <div>
                <label htmlFor="lead-nombre" className="sr-only">
                  Nombre
                </label>
                <input
                  id="lead-nombre"
                  name="nombre"
                  required
                  autoComplete="name"
                  placeholder="Nombre"
                  className="lead-input"
                />
              </div>
              <div>
                <label htmlFor="lead-email" className="sr-only">
                  Email
                </label>
                <input
                  id="lead-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="Email"
                  className="lead-input"
                />
              </div>
              <div>
                <label htmlFor="lead-telefono" className="sr-only">
                  Teléfono
                </label>
                <input
                  id="lead-telefono"
                  name="telefono"
                  type="tel"
                  autoComplete="tel"
                  placeholder="Teléfono"
                  className="lead-input"
                />
              </div>
              <div>
                <label htmlFor="lead-mensaje" className="sr-only">
                  Mensaje
                </label>
                <textarea
                  id="lead-mensaje"
                  name="mensaje"
                  rows={4}
                  placeholder="Cuéntanos qué necesitas"
                  className="lead-input min-h-[100px] resize-y"
                />
              </div>

              {status === "success" ? (
                <p
                  role="status"
                  className="rounded-xl border border-rebo-turquoise/40 bg-rebo-turquoise/10 px-3 py-2 text-center text-sm font-medium text-rebo-turquoise"
                >
                  Solicitud enviada. Te contactamos pronto.
                </p>
              ) : null}
              {status === "error" ? (
                <p role="alert" className="rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                  {errorMsg}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={status === "loading"}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rebo-turquoise to-rebo-primary py-3.5 text-sm font-bold text-[#042422] shadow-lg shadow-rebo-primary/30 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    Enviando…
                  </>
                ) : (
                  "Enviar"
                )}
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </LeadModalContext.Provider>
  );
}

const solidPrimary =
  "inline-flex items-center justify-center rounded-2xl bg-rebo-primary px-8 py-4 text-base font-bold text-white shadow-lg shadow-rebo-primary/25 transition hover:bg-[#159a94] hover:shadow-xl hover:shadow-rebo-primary/35";

const outlinePrimary =
  "inline-flex items-center justify-center rounded-2xl border-2 border-rebo-primary px-8 py-4 text-base font-bold text-rebo-primary transition hover:bg-rebo-primary/5";

/** CTA primario: abre modal con solución o navega a href. */
export function PrimaryLeadCTA({
  solutionName,
  href,
  label,
  variant = "solid",
}: {
  solutionName?: string;
  href: string;
  label: string;
  variant?: "solid" | "outline";
}) {
  const { open } = useLeadModal();
  const cls = variant === "solid" ? solidPrimary : outlinePrimary;

  if (solutionName) {
    return (
      <button type="button" className={cls} onClick={() => open(solutionName)}>
        {label}
      </button>
    );
  }

  return (
    <Link href={href} className={cls}>
      {label}
    </Link>
  );
}
