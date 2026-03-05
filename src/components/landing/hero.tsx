"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

export default function Hero() {
  return (
    <section className="relative flex items-center justify-center overflow-hidden bg-white pt-32 pb-24 sm:pt-40 sm:pb-32">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-linear-to-b from-neutral-50 to-white pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent">
            Save up to 70% on premium memberships
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="mt-8 text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-neutral-900 leading-[1.08]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease }}
        >
          Memberships,{" "}
          <span className="text-accent">redefined.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="mt-6 text-lg md:text-xl text-neutral-500 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease }}
        >
          India&apos;s trusted marketplace for buying and selling premium club, gym,
          resort, and co-working memberships.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="mt-10 flex items-center justify-center gap-4 flex-wrap"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35, ease }}
        >
          <Link
            href="/marketplace"
            className="group inline-flex items-center gap-2.5 px-8 py-4 text-sm font-semibold tracking-wide rounded-full bg-neutral-900 text-white hover:bg-neutral-800 transition-colors duration-200"
          >
            Explore Memberships
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/dashboard/seller/listings/new"
            className="inline-flex items-center gap-2.5 px-8 py-4 text-sm font-semibold tracking-wide rounded-full text-neutral-700 border border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50 transition-all duration-200"
          >
            List Yours
          </Link>
        </motion.div>

        {/* Trust line */}
        <motion.p
          className="mt-8 text-sm text-neutral-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5, ease }}
        >
          Trusted by 5,000+ members across India
        </motion.p>
      </div>
    </section>
  );
}
