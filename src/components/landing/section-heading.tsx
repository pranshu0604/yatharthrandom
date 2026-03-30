"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  className?: string;
  light?: boolean;
}

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

export default function SectionHeading({
  title,
  subtitle,
  className,
  light = false,
}: SectionHeadingProps) {
  return (
    <div className={cn("text-center", className)}>
      <motion.h2
        className={cn(
          "font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight",
          light ? "text-neutral-900" : "text-white"
        )}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease }}
      >
        {title}
      </motion.h2>

      {subtitle && (
        <motion.p
          className={cn(
            "mt-4 max-w-lg mx-auto",
            light ? "text-neutral-500" : "text-neutral-500"
          )}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease, delay: 0.15 }}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
