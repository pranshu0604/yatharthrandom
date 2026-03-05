"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

export default function CTASection() {
  return (
    <section className="py-28 sm:py-36 bg-neutral-50 border-t border-neutral-100">
      <motion.div
        className="max-w-3xl mx-auto px-6 sm:px-8 text-center"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease }}
      >
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 tracking-tight leading-tight">
          Start saving on{" "}
          <span className="text-accent">premium memberships</span>{" "}
          today.
        </h2>

        <p className="mt-5 text-neutral-500 text-lg max-w-xl mx-auto leading-relaxed">
          Whether you&apos;re buying or selling, ReMemberX makes it effortless.
        </p>

        <motion.div
          className="mt-10 flex items-center justify-center gap-4"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.2, ease }}
        >
          <Link
            href="/marketplace"
            className="group inline-flex items-center gap-2.5 px-8 py-4 text-sm font-semibold tracking-wide rounded-full bg-neutral-900 text-white hover:bg-neutral-800 transition-colors duration-200"
          >
            Browse Memberships
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/dashboard/seller/listings/new"
            className="inline-flex items-center gap-2.5 px-8 py-4 text-sm font-semibold tracking-wide rounded-full text-neutral-700 border border-neutral-300 hover:border-neutral-400 hover:bg-white transition-all duration-200"
          >
            List Yours
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
