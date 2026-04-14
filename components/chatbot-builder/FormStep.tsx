import { ReactNode } from "react";

type FormStepProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export function FormStep({ title, description, children }: FormStepProps) {
  return (
    <section className="rounded-3xl border border-rebo-subtle bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-2xl font-bold tracking-tight text-rebo-ink">{title}</h2>
      {description ? <p className="mt-2 text-sm text-rebo-muted">{description}</p> : null}
      <div className="mt-6 space-y-4">{children}</div>
    </section>
  );
}

