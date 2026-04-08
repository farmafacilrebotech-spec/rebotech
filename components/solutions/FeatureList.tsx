import { Check } from "lucide-react";

export function FeatureList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-4" role="list">
      {items.map((text) => (
        <li key={text} className="flex gap-3">
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-rebo-primary/12 text-rebo-primary">
            <Check className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
          </span>
          <span className="text-base leading-relaxed text-rebo-ink">{text}</span>
        </li>
      ))}
    </ul>
  );
}
