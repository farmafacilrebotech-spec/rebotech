import Image from "next/image";

type Aspect = "video" | "square" | "wide";

const aspectClass: Record<Aspect, string> = {
  video: "aspect-video",
  square: "aspect-square max-h-[min(100%,420px)]",
  wide: "aspect-[21/9] min-h-[200px]",
};

export function MockupContainer({
  children,
  caption,
  className = "",
  aspect = "video",
  alt = "",
  imageSrc,
}: {
  children?: React.ReactNode;
  caption?: string;
  className?: string;
  aspect?: Aspect;
  alt?: string;
  /** Cuando tengas captura real, pásala aquí y se mostrará en lugar del placeholder */
  imageSrc?: string;
}) {
  return (
    <figure
      className={`overflow-hidden rounded-2xl border border-rebo-subtle bg-white shadow-[0_16px_48px_-20px_rgba(29,28,28,0.12),0_4px_16px_-4px_rgba(26,187,179,0.08)] ring-1 ring-black/[0.03] ${className}`}
    >
      <div
        className={`relative w-full overflow-hidden bg-gradient-to-b from-rebo-bg to-white ${aspectClass[aspect]}`}
      >
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={alt || caption || "Captura del producto"}
            fill
            className="object-cover object-top"
            sizes="(max-width: 768px) 100vw, 720px"
          />
        ) : (
          children ?? (
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <Image
                src="/mockup-clean.png"
                alt={alt || caption || "ReBoTech Solutions mockup"}
                width={900}
                height={600}
                className="h-auto w-full rounded-2xl object-contain shadow-2xl"
              />
            </div>
          )
        )}
      </div>
      {caption && imageSrc ? (
        <figcaption className="border-t border-rebo-subtle px-4 py-3 text-center text-xs text-rebo-muted">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
