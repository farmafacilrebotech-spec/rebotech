"use client";

import { motion } from "framer-motion";

export type DiagnosticoLeadData = {
  nombre: string;
  email: string;
  telefono: string;
};

type Props = {
  data: DiagnosticoLeadData;
  onChange: (data: DiagnosticoLeadData) => void;
  onSubmit: () => void;
};

const fieldClass =
  "w-full rounded-2xl border border-white/[0.12] bg-white/[0.05] px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#4ed3c2]/60 focus:ring-2 focus:ring-[#4ed3c2]/25";

export function DiagnosticoLeadForm({ data, onChange, onSubmit }: Props) {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!data.nombre.trim() || !data.email.trim()) return;
    if (!data.email.includes("@")) return;
    onSubmit();
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
      className="w-full max-w-md space-y-5"
    >
      <p className="text-center text-sm text-white/55">
        Déjanos tus datos para personalizar el informe y agilizar el contacto al final. No volveremos a pedirlos.
      </p>
      <div>
        <label htmlFor="diag-nombre" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/50">
          Nombre <span className="text-[#4ed3c2]">*</span>
        </label>
        <input
          id="diag-nombre"
          name="nombre"
          required
          autoComplete="name"
          value={data.nombre}
          onChange={(e) => onChange({ ...data, nombre: e.target.value })}
          className={fieldClass}
          placeholder="Tu nombre"
        />
      </div>
      <div>
        <label htmlFor="diag-email" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/50">
          Email <span className="text-[#4ed3c2]">*</span>
        </label>
        <input
          id="diag-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          value={data.email}
          onChange={(e) => onChange({ ...data, email: e.target.value })}
          className={fieldClass}
          placeholder="tu@empresa.com"
        />
      </div>
      <div>
        <label htmlFor="diag-telefono" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/50">
          Teléfono <span className="text-white/35">(opcional)</span>
        </label>
        <input
          id="diag-telefono"
          name="telefono"
          type="tel"
          autoComplete="tel"
          value={data.telefono}
          onChange={(e) => onChange({ ...data, telefono: e.target.value })}
          className={fieldClass}
          placeholder="+34 600 000 000"
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-2xl bg-[#4ed3c2] py-4 text-base font-bold text-[#05080c] shadow-[0_12px_40px_-12px_rgba(78,211,194,0.5)] transition hover:bg-[#6bdfd0]"
      >
        Empezar diagnóstico
      </button>
    </motion.form>
  );
}
