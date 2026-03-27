"use client";

import { motion } from "framer-motion";

/* ------------------------------------------------------------------ */
/* Stats — typography-driven, no boxes, no icons                       */
/* Just numbers and labels separated by thin vertical dividers.        */
/* ------------------------------------------------------------------ */

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

const stats = [
  { value: "500+", label: "Memberships Listed" },
  { value: "₹2Cr+", label: "Saved by Buyers" },
  { value: "1,000+", label: "Active Members" },
  { value: "4.9", label: "User Rating" },
];

export default function StatsBar() {
  return (
    <section className="py-16 sm:py-20 bg-black border-y border-neutral-800/40">
      <motion.div
        className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease }}
      >
        <div className="flex flex-wrap justify-center sm:justify-between items-baseline gap-y-10">
          {stats.map((stat, i) => (
            <div key={stat.label} className="flex items-baseline gap-6 sm:gap-8">
              <div className="text-center px-2 sm:px-0">
                <span className="block text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight">
                  {stat.value}
                </span>
                <span className="block mt-2 text-xs uppercase tracking-[0.2em] text-neutral-500">
                  {stat.label}
                </span>
              </div>
              {i < stats.length - 1 && (
                <div className="hidden sm:block w-px h-10 bg-neutral-800 self-center" />
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
