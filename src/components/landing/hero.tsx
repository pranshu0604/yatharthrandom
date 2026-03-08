"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Star, Shield, MapPin, ChevronDown } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

/* ------------------------------------------------------------------ */
/* Mockup Component                                                   */
/* ------------------------------------------------------------------ */
function MembershipCardMockup() {
  return (
    <motion.div
      className="relative w-96 xl:w-[440px] perspective-1000"
      initial={{ opacity: 0, x: 60, rotateY: -12 }}
      animate={{ opacity: 1, x: 0, rotateY: -6 }}
      transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Main Card - Metallic Black/Graphite Look */}
      <div
        className="relative aspect-[1.586/1] rounded-2xl overflow-hidden shadow-2xl shadow-neutral-900/40 border border-white/10"
        style={{
          background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
        }}
      >
        {/* Noise Texture */}
        <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        
        {/* Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 skew-x-12 translate-x-[-100%] animate-shimmer"></div>

        <div className="relative h-full p-6 flex flex-col justify-between z-10">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
                 <div className="h-4 w-4 bg-secondary rounded-full"></div>
              </div>
              <span className="text-white/90 font-medium tracking-wide">ReMemberX</span>
            </div>
            <span className="text-white/50 text-xs font-mono tracking-widest">PLATINUM TIER</span>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
               <div className="h-10 w-12 rounded bg-gradient-to-br from-yellow-200 to-yellow-500 opacity-80" /> 
               <div className="space-y-1">
                 <div className="h-1 w-24 bg-white/20 rounded-full" />
                 <div className="h-1 w-16 bg-white/10 rounded-full" />
               </div>
            </div>
            
            <div className="flex justify-between items-end">
              <div>
                <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1">MEMBER</p>
                <p className="text-white font-mono text-lg tracking-wider">RAJESH KUMAR</p>
              </div>
              <div className="text-right">
                <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1">VALID THRU</p>
                <p className="text-white font-mono text-sm">08/29</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements - "Glass" style */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="absolute -right-8 top-12 p-4 rounded-xl glass-dark border border-white/10 shadow-xl backdrop-blur-xl max-w-[180px]"
      >
        <div className="flex items-center gap-3 mb-2">
           <div className="h-2 w-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]"></div>
           <span className="text-xs text-white/80 font-medium">Live Market</span>
        </div>
        <div className="space-y-1">
           <div className="text-xs text-white/40">Current Ask</div>
           <div className="text-xl font-bold text-white tracking-tight">₹2,45,000</div>
           <div className="text-[10px] text-green-400 flex items-center gap-1">
             <span className="rotate-180">▼</span> 12% below market
           </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Hero() {
  return (
    <section className="relative flex min-h-[90vh] items-center overflow-hidden bg-white pt-20 pb-20">
      
      {/* Background - Architectural Grid */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-secondary/20 opacity-20 blur-[100px]"></div>
        <div className="absolute right-0 bottom-0 -z-10 h-[400px] w-[400px] rounded-full bg-primary/5 opacity-30 blur-[120px]"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 w-full">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-20">
          
          {/* Text Content */}
          <div className="flex-1 max-w-2xl text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/50 px-3 py-1 text-xs font-medium text-neutral-600 backdrop-blur-sm mb-8"
            >
              <span className="flex h-2 w-2 rounded-full bg-secondary animate-pulse"></span>
              India's Premier Membership Exchange
            </motion.div>
            
            <motion.h1
              className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tighter text-neutral-900 leading-[1.1] mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Unlock Exclusive <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-900 via-neutral-600 to-neutral-900 pb-2">
                Access & Lifestyle.
              </span>
            </motion.h1>

            <motion.p
              className="text-lg text-neutral-500 leading-relaxed mb-10 max-w-lg mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Buy and sell transferable memberships for India's most prestigious clubs, gyms, and resorts. Secure, verified, and seamless.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Link
                href="/marketplace"
                className="w-full sm:w-auto px-8 py-4 bg-neutral-900 text-white text-sm font-semibold rounded-full hover:bg-black transition-all shadow-lg shadow-neutral-900/20 hover:shadow-neutral-900/40 hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                Browse Marketplace
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/dashboard/seller/listings/new"
                className="w-full sm:w-auto px-8 py-4 bg-white text-neutral-900 border border-neutral-200 text-sm font-semibold rounded-full hover:bg-neutral-50 hover:border-neutral-300 transition-all flex items-center justify-center"
              >
                Sell Membership
              </Link>
            </motion.div>
            
            <motion.div 
               className="mt-12 flex items-center justify-center lg:justify-start gap-8 opacity-60 grayscale"
               initial={{ opacity: 0 }}
               animate={{ opacity: 0.6 }}
               transition={{ delay: 0.6, duration: 1 }}
            >
               {/* Simple logos placeholder text/svgs for "Trusted By" */}
               <div className="text-xs font-semibold tracking-widest text-neutral-400 uppercase">Trusted By Members Of</div>
               <div className="font-serif font-bold text-neutral-800">Gymkhana</div>
               <div className="font-serif font-bold text-neutral-800">Soho House</div>
               <div className="font-serif font-bold text-neutral-800">Club Marriott</div>
            </motion.div>
          </div>

          {/* Graphic Content */}
          <div className="hidden lg:block relative z-10">
            <MembershipCardMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
