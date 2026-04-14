type StepperProps = {
  steps: string[];
  currentStep: number;
};

export function Stepper({ steps, currentStep }: StepperProps) {
  const progress = Math.round(((currentStep + 1) / steps.length) * 100);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.14em] text-rebo-muted">
        <span>
          Paso {currentStep + 1} de {steps.length}
        </span>
        <span>{progress}%</span>
      </div>
      <div className="h-2 rounded-full bg-rebo-subtle">
        <div
          className="h-full rounded-full bg-rebo-primary transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-4 lg:grid-cols-7">
        {steps.map((step, idx) => (
          <div
            key={step}
            className={`rounded-xl border px-3 py-2 text-xs ${
              idx === currentStep
                ? "border-rebo-primary bg-rebo-primary/5 text-rebo-ink"
                : "border-rebo-subtle bg-white text-rebo-muted"
            }`}
          >
            {step}
          </div>
        ))}
      </div>
    </div>
  );
}

