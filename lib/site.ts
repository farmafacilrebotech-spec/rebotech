export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rebotech.es";

/** Solo dígitos, con prefijo país (ej. 34600111222). Sin + ni espacios. */
export function getWhatsappDigits(): string {
  return (process.env.NEXT_PUBLIC_WHATSAPP_PHONE ?? "").replace(/\D/g, "");
}

export function buildWhatsappLink(
  message = "Hola, me gustaría información sobre ReBoTech Solutions.",
): string | null {
  const digits = getWhatsappDigits();
  if (!digits) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export type SocialNetwork = "x" | "facebook" | "tiktok" | "instagram" | "linkedin" | "youtube";

export type SocialSlot = {
  network: SocialNetwork;
  label: string;
  envKey: string;
  /** URL final: la de .env o, si falta, /contacto en el mismo sitio */
  href: string;
  /** true si viene de variable de entorno (perfil real) */
  fromEnv: boolean;
};

function readUrl(envKey: string): string | null {
  const v = process.env[envKey]?.trim();
  if (!v || !v.startsWith("http")) return null;
  return v;
}

/**
 * Mismo orden que `Profile/index.html`. Si no hay URL en .env, el botón enlaza a /contacto
 * (misma pestaña) para que nunca se vea “bloqueado”.
 */
export function getSocialSlots(): SocialSlot[] {
  const rows: { network: SocialNetwork; label: string; envKey: string }[] = [
    { network: "x", label: "X", envKey: "NEXT_PUBLIC_SOCIAL_X" },
    { network: "facebook", label: "Facebook", envKey: "NEXT_PUBLIC_SOCIAL_FACEBOOK" },
    { network: "tiktok", label: "TikTok", envKey: "NEXT_PUBLIC_SOCIAL_TIKTOK" },
    { network: "instagram", label: "Instagram", envKey: "NEXT_PUBLIC_SOCIAL_INSTAGRAM" },
    { network: "linkedin", label: "LinkedIn", envKey: "NEXT_PUBLIC_SOCIAL_LINKEDIN" },
    { network: "youtube", label: "YouTube", envKey: "NEXT_PUBLIC_SOCIAL_YOUTUBE" },
  ];
  return rows.map((r) => {
    const envHref = readUrl(r.envKey);
    return {
      ...r,
      href: envHref ?? "/contacto",
      fromEnv: envHref !== null,
    };
  });
}
