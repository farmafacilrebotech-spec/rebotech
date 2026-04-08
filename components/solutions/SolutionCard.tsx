"use client";

import type { ProductIconId } from "@/lib/products";
import type { SolutionSlug } from "@/lib/solutions";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  MessageSquare,
  Pill,
  QrCode,
  Ticket,
  Trophy,
  Vote,
  Zap,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const iconMap = {
  pill: Pill,
  vote: Vote,
  trophy: Trophy,
  ticket: Ticket,
  qr: QrCode,
  message: MessageSquare,
  badge: BadgeCheck,
  zap: Zap,
} as const;

export function SolutionCard({
  slug,
  name,
  description,
  iconId,
  cardClass,
  featured,
}: {
  slug: SolutionSlug;
  name: string;
  description: string;
  iconId: ProductIconId;
  cardClass: string;
  featured?: boolean;
}) {
  const Icon = iconMap[iconId];
  const href = `/soluciones/${slug}`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-24px" }}
      transition={{ duration: 0.45 }}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      className={`flex h-full flex-col rounded-2xl border p-6 transition-shadow duration-300 hover:shadow-[0_20px_48px_-16px_rgba(26,187,179,0.2)] sm:p-7 ${cardClass} ${
        featured ? "ring-2 ring-rebo-primary/25 ring-offset-2 ring-offset-rebo-bg" : ""
      }`}
    >
      <Link href={href} className="flex flex-1 flex-col outline-none focus-visible:ring-2 focus-visible:ring-rebo-primary focus-visible:ring-offset-2">
        <div className="mb-4 flex items-start justify-between gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rebo-bg text-rebo-primary ring-1 ring-rebo-primary/12">
            <Icon className="h-6 w-6" strokeWidth={1.65} aria-hidden />
          </span>
          {featured ? (
            <span className="rounded-full bg-rebo-primary/12 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-rebo-primary">
              Destacada
            </span>
          ) : null}
        </div>
        <h3 className="text-lg font-bold text-rebo-ink">{name}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-rebo-muted">{description}</p>
        <span
          className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-rebo-primary"
          aria-hidden
        >
          Ver solución
          <ArrowRight className="h-4 w-4" />
        </span>
      </Link>
    </motion.article>
  );
}
