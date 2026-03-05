"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Star, Shield, MapPin, ChevronDown } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

function MembershipCardMockup() {
  return (
    <motion.div
      className="relative w-85 sm:w-95 mb-8"
      initial={{ opacity: 0, x: 40, rotateY: -8 }}
      animate={{ opacity: 1, x: 0, rotateY: 0 }}
      transition={{ duration: 0.8, delay: 0.4, ease }}
      style={{ perspective: "1000px" }}
    >
      {/* Card */}
      <div
        className="relative rounded-2xl bg-white border border-neutral-200 shadow-[0_20px_60px_-12px_rgba(0,0,0,0.12),0_8px_24px_-8px_rgba(0,0,0,0.06)] overflow-hidden"
        style={{ transform: "rotate(-2deg)" }}
      >
        {/* Card header gradient */}
        <div className="h-28 bg-linear-to-br from-primary via-primary-light to-primary relative overflow-hidden">
          {/* Subtle circle pattern */}
          <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full border border-white/10" />
          <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full border border-white/10" />
          <div className="absolute top-4 left-5 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
              <Star className="h-4 w-4 text-secondary fill-secondary" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-white/70 uppercase tracking-wider">Premium Club</p>
              <p className="text-sm font-bold text-white">Mumbai Gymkhana</p>
            </div>
          </div>
          <div className="absolute bottom-3 right-4">
            <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-white">
              45% OFF
            </span>
          </div>
        </div>

        {/* Card body */}
        <div className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[10px] text-neutral-400 font-medium uppercase tracking-wider">Member</p>
              <p className="text-sm font-semibold text-neutral-800">Rajesh K.</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-neutral-400 font-medium uppercase tracking-wider">Valid Until</p>
              <p className="text-sm font-semibold text-neutral-800">Mar 2028</p>
            </div>
          </div>

          <div className="h-px bg-neutral-100 mb-3" />

          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-neutral-400 line-through">₹4,50,000</span>
              <p className="text-lg font-bold text-accent">₹2,47,500</p>
            </div>
            <div className="flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-accent" />
              <span className="text-[11px] font-semibold text-accent">Verified</span>
            </div>
          </div>

          <div className="flex items-center gap-1 mt-2 text-[11px] text-neutral-400">
            <MapPin className="h-3 w-3" />
            <span>Mumbai, Maharashtra</span>
          </div>
        </div>
      </div>

      {/* Savings badge floating */}
      <motion.div
        className="absolute -bottom-8 -left-6 rounded-xl bg-white border border-accent/20 px-3 py-2 shadow-[0_8px_24px_-4px_rgba(46,196,182,0.2)]"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.9, ease }}
      >
        <p className="text-[10px] font-medium text-accent uppercase tracking-wider">You Save</p>
        <p className="text-lg font-bold text-accent">₹2,02,500</p>
      </motion.div>
    </motion.div>
  );
}

export default function Hero() {
  return (
    <section className="relative flex items-center overflow-hidden bg-white pt-32 pb-24 sm:pt-40 sm:pb-32">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-linear-to-b from-neutral-50 to-white pointer-events-none" />

      {/* Geometric pattern — subtle cross-hatch */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.035]">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="hero-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M0 20h40M20 0v40" stroke="currentColor" strokeWidth="0.5" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-pattern)" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left — text */}
          <div className="flex-1 text-center lg:text-left">
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
              className="mt-8 text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-neutral-900 leading-[1.08]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease }}
            >
              Memberships,{" "}
              <span className="text-accent">redefined.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="mt-6 text-lg md:text-xl text-neutral-500 max-w-xl leading-relaxed"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease }}
            >
              India&apos;s trusted marketplace for buying and selling premium club, gym,
              resort, and co-working memberships.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="mt-10 flex items-center gap-4 flex-wrap justify-center lg:justify-start"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35, ease }}
            >
              <Link
                href="/marketplace"
                className="group inline-flex items-center gap-2.5 px-8 py-4 text-sm font-semibold tracking-wide rounded-full bg-neutral-900 text-white hover:bg-neutral-800 hover:shadow-[0_0_20px_rgba(46,196,182,0.3)] transition-all duration-300"
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

          {/* Right — membership card mockup */}
          <div className="hidden lg:flex shrink-0 items-center justify-center">
            <MembershipCardMockup />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="h-5 w-5 text-neutral-300" />
        </motion.div>
      </motion.div>
    </section>
  );
}
