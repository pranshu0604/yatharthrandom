"use client";

import { motion } from "framer-motion";

/* ------------------------------------------------------------------ */
/* Single impactful testimonial — with avatar                          */
/* ------------------------------------------------------------------ */

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

export default function Testimonial() {
  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
        <motion.blockquote
          className="border-t border-neutral-200 pt-12 sm:pt-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease }}
        >
          <p className="font-serif text-2xl sm:text-3xl lg:text-4xl font-medium text-neutral-900 leading-snug tracking-tight">
            &ldquo;We saved over ₹3.5 lakhs on our family&apos;s club membership
            through ReMemberX. The whole process was transparent, verified, and
            incredibly smooth. It&apos;s like the marketplace premium memberships
            always needed.&rdquo;
          </p>

          <footer className="mt-8 sm:mt-10 flex items-center gap-4">
            {/* Avatar */}
            <div className="shrink-0 w-12 h-12 rounded-full bg-linear-to-br from-accent/40 to-secondary/40 flex items-center justify-center text-white font-serif text-lg font-bold select-none">
              AS
            </div>

            <cite className="not-italic">
              <span className="block text-base font-semibold text-neutral-800">
                Ananya Sharma
              </span>
              <span className="block text-sm text-neutral-500 mt-0.5">
                Buyer, Mumbai — Saved 62% on a Gold&apos;s Gym Lifetime
                Membership
              </span>
            </cite>
          </footer>
        </motion.blockquote>
      </div>
    </section>
  );
}
