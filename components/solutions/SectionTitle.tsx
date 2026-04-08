export function SectionTitle({
  eyebrow,
  title,
  description,
  align = "left",
  as: Tag = "h2",
  id,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  as?: "h2" | "h3";
  id?: string;
}) {
  const alignClass = align === "center" ? "text-center mx-auto" : "";
  return (
    <div className={`max-w-2xl ${alignClass}`}>
      {eyebrow ? (
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-rebo-primary">
          {eyebrow}
        </p>
      ) : null}
      <Tag
        id={id}
        className={`mt-3 text-2xl font-bold tracking-tight text-rebo-ink sm:text-3xl ${align === "center" ? "mx-auto max-w-xl" : ""}`}
      >
        {title}
      </Tag>
      {description ? (
        <p className={`mt-4 text-base leading-relaxed text-rebo-muted ${align === "center" ? "max-w-xl mx-auto" : ""}`}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
