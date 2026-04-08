export function BrandWordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`select-none font-sans text-base font-bold tracking-tight text-rebo-ink sm:text-lg ${className}`}
    >
      REBOTECH{" "}
      <span className="bg-gradient-to-r from-rebo-primary to-rebo-turquoise bg-clip-text text-transparent">
        SOLUTIONS
      </span>
    </span>
  );
}
