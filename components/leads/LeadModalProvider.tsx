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

export type LeadSolutionContext = { id: string; name: string };

export type LeadModalPrefill = {
  nombre?: string;
  email?: string;
  telefono?: string;
  mensaje?: string;
};

export type LeadModalDiagnosticoMeta = {
  score: number;
  nivel: "bajo" | "medio" | "alto";
};

export type LeadModalOpenArgs = {
  id: string;
  name: string;
  prefill?: LeadModalPrefill;
  diagnostico?: LeadModalDiagnosticoMeta;
};

type LeadModalContextValue = {
  open: (args: LeadModalOpenArgs) => void;
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
  const [leadSolution, setLeadSolution] = useState<LeadSolutionContext | null>(null);
  const [prefill, setPrefill] = useState<LeadModalPrefill | null>(null);
  const [diagnosticoMeta, setDiagnosticoMeta] = useState<LeadModalDiagnosticoMeta | null>(null);
  const [formKey, setFormKey] = useState(0);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const titleId = useId();

  const close = useCallback(() => {
    setVisible(false);
    setLeadSolution(null);
    setPrefill(null);
    setDiagnosticoMeta(null);
    setStatus("idle");
    setErrorMsg("");
  }, []);

  const open = useCallback((args: LeadModalOpenArgs) => {
    setLeadSolution({ id: args.id, name: args.name });
    setPrefill(args.prefill ?? null);
    setDiagnosticoMeta(args.diagnostico ?? null);
    setFormKey((k) => k + 1);
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
    const payload: Record<string, string | number> = {
      solucion: leadSolution?.id ?? "",
      nombre: String(fd.get("nombre") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      telefono: String(fd.get("telefono") ?? "").trim(),
      mensaje: String(fd.get("mensaje") ?? "").trim(),
    };

    if (diagnosticoMeta) {
      payload.diagnostico_score = diagnosticoMeta.score;
      payload.diagnostico_nivel = diagnosticoMeta.nivel;
    }

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

  const p = prefill ?? {};

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
              Solución:{" "}
              <span className="font-semibold text-rebo-turquoise">
                {leadSolution?.name ?? ""}
              </span>
            </p>

            <form key={formKey} onSubmit={handleSubmit} className="lead-form space-y-3">
              <input type="hidden" name="solucion" value={leadSolution?.id ?? ""} readOnly />
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
                  defaultValue={p.nombre ?? ""}
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
                  defaultValue={p.email ?? ""}
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
                  defaultValue={p.telefono ?? ""}
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
                  defaultValue={p.mensaje ?? ""}
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
  leadSolution,
  href,
  label,
  variant = "solid",
}: {
  /** Si se indica, el CTA abre el modal y el lead envía `id` como solución. */
  leadSolution?: LeadSolutionContext;
  href: string;
  label: string;
  variant?: "solid" | "outline";
}) {
  const { open } = useLeadModal();
  const cls = variant === "solid" ? solidPrimary : outlinePrimary;

  if (leadSolution) {
    return (
      <button
        type="button"
        className={cls}
        onClick={() => open({ id: leadSolution.id, name: leadSolution.name })}
      >
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
