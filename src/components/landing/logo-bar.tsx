"use client";

import Image from "next/image";
import { motion } from "framer-motion";

/* ------------------------------------------------------------------ */
/* Brand logo bar — large, confident, not hidden                       */
/* ------------------------------------------------------------------ */

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

interface Brand {
  name: string;
  src: string;
  width: number;
  height: number;
}

const brands: Brand[] = [
  { name: "Bombay Gymkhana", src: "/brands/bombay-gymkhana.svg", width: 200, height: 40 },
  { name: "DLF Club", src: "/brands/dlf-club.svg", width: 120, height: 40 },
  { name: "Marriott", src: "/brands/marriott.svg", width: 160, height: 40 },
  { name: "Gold's Gym", src: "/brands/golds-gym.svg", width: 140, height: 40 },
  { name: "Club Mahindra", src: "/brands/club-mahindra.svg", width: 180, height: 40 },
  { name: "Cult.fit", src: "/brands/cultfit.svg", width: 120, height: 40 },
  { name: "ITC Hotels", src: "/brands/itc-hotels.svg", width: 130, height: 40 },
  { name: "Country Club", src: "/brands/country-club.svg", width: 160, height: 40 },
];

function BrandLogo({ brand }: { brand: Brand }) {
  return (
    <div className="flex items-center justify-center px-5 md:px-7 shrink-0">
      <Image
        src={brand.src}
        alt={brand.name}
        width={brand.width}
        height={brand.height}
        className="h-10 md:h-12 w-auto brightness-75 hover:brightness-100 transition-[filter] duration-300"
        unoptimized
      />
    </div>
  );
}

export default function LogoBar() {
  return (
    <motion.section
      className="py-14 sm:py-16 bg-neutral-950 overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease }}
    >
      <p className="text-center text-[11px] font-medium uppercase tracking-[0.25em] text-neutral-500 mb-10">
        Memberships from India&apos;s most prestigious brands
      </p>

      {/* Desktop — static row */}
      <div className="hidden sm:flex items-center justify-center">
        {brands.map((brand, i) => (
          <div key={brand.name} className="flex items-center">
            <BrandLogo brand={brand} />
            {i < brands.length - 1 && (
              <div className="w-px h-5 bg-neutral-800" />
            )}
          </div>
        ))}
      </div>

      {/* Mobile — infinite marquee */}
      <div className="sm:hidden relative h-12 overflow-hidden">
        <ul className="logo-marquee flex items-center h-full">
          {brands.map((brand) => (
            <li key={brand.name}>
              <BrandLogo brand={brand} />
            </li>
          ))}
          {brands.map((brand) => (
            <li key={`dup-${brand.name}`} aria-hidden="true">
              <BrandLogo brand={brand} />
            </li>
          ))}
        </ul>
      </div>
    </motion.section>
  );
}
