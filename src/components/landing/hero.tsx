"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import HeroBgCanvas from "./hero-bg-canvas";

/* ------------------------------------------------------------------ */
/* Cycling word animation                                              */
/* ------------------------------------------------------------------ */
const cyclingWords = [
  { word: "Memberships", color: "#ffffff" },
  { word: "Gym",         color: "#2EC4B6" },   // teal accent
  { word: "Club",        color: "#C9A96E" },   // gold secondary
  { word: "Resort",      color: "#a78bfa" },   // violet
  { word: "Hotel",       color: "#f472b6" },   // rose
  { word: "Spa",         color: "#34d399" },   // emerald
  { word: "Sports",      color: "#fb923c" },   // orange
];

function CyclingWord() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % cyclingWords.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const current = cyclingWords[index];

  return (
    /*
     * Outer span clips horizontally (masks the slide-in/out motion)
     * but NOT vertically — descenders like y/p/g need to bleed below.
     * We achieve this by making the clip box taller than the font:
     * extra top/bottom padding absorbs the clip boundary.
     */
    <span
      className="relative inline-block align-bottom"
      style={{
        minWidth: "1ch",
        overflowX: "hidden",
        overflowY: "visible",
        paddingTop: "0.15em",
        paddingBottom: "0.25em",
        marginTop: "-0.15em",
        marginBottom: "-0.25em",
      }}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={current.word}
          initial={{ y: "110%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-110%", opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block"
          style={{ color: current.color }}
        >
          {current.word}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Hero — video background with canvas fallback                        */
/* ------------------------------------------------------------------ */
export default function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-black pt-20">

      {/* ---- Background layers ---- */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Canvas fallback — renders immediately while video loads */}
        <HeroBgCanvas />

        {/* Desktop video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="hidden sm:block absolute inset-0 w-full h-full object-cover"
        >
          <source src="/hero-desktop.webm" type="video/webm" />
          <source src="/hero-desktop.mp4" type="video/mp4" />
        </video>

        {/* Mobile video (lighter) */}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="sm:hidden absolute inset-0 w-full h-full object-cover"
        >
          <source src="/hero-mobile.webm" type="video/webm" />
          <source src="/hero-mobile.mp4" type="video/mp4" />
        </video>

        {/* Darken for text readability */}
        <div className="absolute inset-0 bg-black/55" />

        {/* Dot-grid texture */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* ---- Content ---- */}
      <div className="relative z-10 mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12 w-full h-full flex flex-col justify-center">

        <div className="space-y-2 lg:space-y-0">
          <motion.h1
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-[12vw] leading-[0.85] font-serif tracking-tighter text-white drop-shadow-[0_2px_30px_rgba(0,0,0,0.8)]"
          >
            Trade
          </motion.h1>

          <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-16">
            <motion.h1
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-[12vw] leading-[0.85] font-serif tracking-tighter text-neutral-500 italic drop-shadow-[0_2px_30px_rgba(0,0,0,0.8)]"
            >
              Premium
            </motion.h1>

            <Link href="/marketplace">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, delay: 0.4 }}
                className="hidden lg:flex w-64 h-24 rounded-full border border-white/20 backdrop-blur-md items-center justify-between px-2 relative overflow-hidden group cursor-pointer"
              >
                <div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <span className="ml-6 text-sm font-mono text-white/60">EST. 2026</span>
                <div className="h-20 w-20 rounded-full bg-white/10 text-white flex items-center justify-center">
                  <ArrowRight className="h-6 w-6 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                </div>
              </motion.div>
            </Link>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-[12vw] leading-[0.85] font-serif tracking-tighter drop-shadow-[0_2px_30px_rgba(0,0,0,0.8)]"
          >
            <CyclingWord />.
          </motion.h1>
        </div>

        <div className="mt-24 lg:mt-32 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end border-t border-white/10 pt-8">
          <div className="lg:col-span-4">
            <p className="text-neutral-400 text-lg leading-relaxed max-w-sm">
              The exclusive marketplace for buying and selling transferable
              memberships to the world&apos;s most prestigious clubs.
            </p>
          </div>

          <div className="lg:col-span-4 flex gap-8">
            <div>
              <span className="block text-2xl font-serif text-white">5k+</span>
              <span className="text-xs text-neutral-500 uppercase tracking-widest">Members</span>
            </div>
            <div>
              <span className="block text-2xl font-serif text-white">₹45Cr</span>
              <span className="text-xs text-neutral-500 uppercase tracking-widest">Volume</span>
            </div>
          </div>

          <div className="lg:col-span-4 lg:text-right">
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-3 text-white border-b border-white pb-1 hover:text-neutral-300 hover:border-neutral-700 transition-colors"
            >
              Start Exploring <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
