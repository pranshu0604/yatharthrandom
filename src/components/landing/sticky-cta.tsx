"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Sticky bottom CTA bar — appears after scrolling past the hero       */
/* Shopify pattern: repeated CTA for conversion optimization           */
/* ------------------------------------------------------------------ */

function subscribeToScroll(callback: () => void) {
  window.addEventListener("scroll", callback, { passive: true });
  return () => window.removeEventListener("scroll", callback);
}

function getScrollSnapshot() {
  return window.scrollY > window.innerHeight * 0.8;
}

function getServerSnapshot() {
  return false;
}

export default function StickyCta() {
  const pastHero = useSyncExternalStore(
    subscribeToScroll,
    getScrollSnapshot,
    getServerSnapshot
  );

  return (
    <AnimatePresence>
      {pastHero && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 sm:hidden"
        >
          <div className="bg-neutral-900/95 backdrop-blur-xl border-t border-neutral-800 px-4 py-3">
            <Link
              href="/marketplace"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent text-white px-5 py-3.5 text-sm font-semibold tracking-wide transition-colors duration-200 hover:bg-accent-light"
            >
              Browse Memberships
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
