"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  Percent,
  Handshake,
  Search,
  type LucideIcon,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* "Why ReMemberX" — editorial layout, not icon-in-box grid            */
/*                                                                     */
/* Two rows:                                                           */
/*   Row 1: one wide card + one narrow card                            */
/*   Row 2: one narrow card + one wide card                            */
/* Cards use left-aligned text, a thin accent line, no rounded boxes.  */
/* ------------------------------------------------------------------ */

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

interface Feature {
  icon: LucideIcon;
  number: string;
  title: string;
  description: string;
  accent: string;
}

const features: Feature[] = [
  {
    icon: ShieldCheck,
    number: "01",
    title: "Verified Sellers",
    description:
      "Every seller is KYC-verified before they can list. Browse knowing each membership is authentic and transferable.",
    accent: "bg-accent",
  },
  {
    icon: Percent,
    number: "02",
    title: "Save Up to 70%",
    description:
      "Access club, gym, resort, and holiday memberships at a fraction of their original price.",
    accent: "bg-secondary",
  },
  {
    icon: Handshake,
    number: "03",
    title: "Secure Transfers",
    description:
      "End-to-end secure membership transfers. No hidden fees, no surprises, no risk.",
    accent: "bg-white",
  },
  {
    icon: Search,
    number: "04",
    title: "Smart Discovery",
    description:
      "Filter by category, city, price, or seller tier. Find the perfect membership in seconds.",
    accent: "bg-accent",
  },
];

function FeatureItem({ feature, index }: { feature: Feature; index: number }) {
  const Icon = feature.icon;

  return (
    <motion.div
      className="group relative py-8 sm:py-10"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease }}
    >
      {/* Accent line top */}
      <div className={`w-8 h-0.5 ${feature.accent} mb-6 transition-all duration-500 group-hover:w-16`} />

      {/* Number + icon row */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xs font-mono text-neutral-600">{feature.number}</span>
        <Icon className="h-4 w-4 text-neutral-500" />
      </div>

      {/* Title */}
      <h3 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight mb-3">
        {feature.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-neutral-500 leading-relaxed max-w-sm">
        {feature.description}
      </p>
    </motion.div>
  );
}

export default function FeatureCards() {
  return (
    <section className="py-24 sm:py-32 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section label */}
        <motion.div
          className="mb-16 sm:mb-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-neutral-500 mb-4">
            Why ReMemberX
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight max-w-xl">
            Built on trust, savings, and seamless transfers.
          </h2>
        </motion.div>

        {/* Asymmetric grid — not 4 identical boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-x-8 lg:gap-x-16 border-t border-neutral-800/60">
          <div className="lg:col-span-5">
            <FeatureItem feature={features[0]} index={0} />
          </div>
          <div className="lg:col-span-7">
            <FeatureItem feature={features[1]} index={1} />
          </div>
          <div className="lg:col-span-7 border-t border-neutral-800/60">
            <FeatureItem feature={features[2]} index={2} />
          </div>
          <div className="lg:col-span-5 border-t border-neutral-800/60">
            <FeatureItem feature={features[3]} index={3} />
          </div>
        </div>
      </div>
    </section>
  );
}
