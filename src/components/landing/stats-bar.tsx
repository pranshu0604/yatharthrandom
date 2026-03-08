"use client";

import { motion } from "framer-motion";
import { Package, IndianRupee, Users, Star } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

const stats = [
  { value: "500+", label: "Memberships Listed", icon: Package },
  { value: "₹2Cr+", label: "Saved by Buyers", icon: IndianRupee },
  { value: "1,000+", label: "Active Members", icon: Users },
  { value: "4.9", label: "User Rating", icon: Star },
];

export default function StatsBar() {
  return (
    <section className="py-12 sm:py-16 bg-neutral-950 border-y border-neutral-800">
      <motion.div
        className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease }}
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                className="text-center p-6 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-none"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08, ease }}
              >
                <div className="mx-auto flex items-center justify-center w-10 h-10 rounded-xl bg-accent/15 mb-3">
                  <Icon className="h-5 w-5 text-accent" />
                </div>
                <p className="text-3xl md:text-4xl font-bold text-white">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-neutral-500 tracking-wide">
                  {stat.label}
                </p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
