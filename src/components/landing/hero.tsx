"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Star, Shield, MapPin, ChevronDown } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

/* ------------------------------------------------------------------ */
/* Minimalist Hero Section                                            */
/* ------------------------------------------------------------------ */
export default function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-black pt-20">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] h-[800px] w-[800px] rounded-full bg-blue-900/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] h-[800px] w-[800px] rounded-full bg-amber-900/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12 w-full h-full flex flex-col justify-center">
        
        {/* Massive Typography */}
        <div className="space-y-2 lg:space-y-0">
          <motion.h1
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-[12vw] leading-[0.85] font-serif tracking-tighter text-white mix-blend-difference"
          >
            Access
          </motion.h1>
          
          <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-16">
            <motion.h1
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-[12vw] leading-[0.85] font-serif tracking-tighter text-neutral-500 italic mix-blend-difference"
            >
              The
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.4 }}
              className="hidden lg:block w-64 h-24 rounded-full border border-white/20 backdrop-blur-md flex items-center justify-between px-2 relative overflow-hidden group cursor-pointer"
            >
               <div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
               <span className="ml-6 text-sm font-mono text-white/60">EST. 2026</span>
               <div className="h-20 w-20 rounded-full bg-white text-black flex items-center justify-center">
                 <ArrowRight className="h-6 w-6 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
               </div>
            </motion.div>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-[12vw] leading-[0.85] font-serif tracking-tighter text-white mix-blend-difference"
          >
            Impossible.
          </motion.h1>
        </div>

        {/* Subtext & CTA - Bottom Aligned */}
        <div className="mt-24 lg:mt-32 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end border-t border-white/10 pt-8">
          <div className="lg:col-span-4">
             <p className="text-neutral-400 text-lg leading-relaxed max-w-sm">
               The exclusive marketplace for buying and selling transferable memberships to the world's most prestigious clubs.
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
               className="inline-flex items-center gap-3 text-white border-b border-white pb-1 hover:text-neutral-300 hover:border-neutral-300 transition-colors"
             >
               Start Exploring <ArrowRight className="h-4 w-4" />
             </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
