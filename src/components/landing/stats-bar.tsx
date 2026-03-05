"use client";

import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

const stats = [
  { value: "500+", label: "Memberships Listed" },
  { value: "₹2Cr+", label: "Saved by Buyers" },
  { value: "1,000+", label: "Active Members" },
  { value: "4.9", label: "User Rating" },
];

export default function StatsBar() {
  return (
    <section className="py-12 sm:py-16 bg-neutral-50 border-y border-neutral-100">
      <motion.div
        className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease }}
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-neutral-900">
                {stat.value}
              </p>
              <p className="mt-2 text-sm text-neutral-500 tracking-wide">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
