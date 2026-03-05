"use client";

import { type ReactNode } from "react";
import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

type Direction = "up" | "down" | "left" | "right";

const directionOffsets: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 40 },
  down: { x: 0, y: -40 },
  left: { x: 40, y: 0 },
  right: { x: -40, y: 0 },
};

export interface ScrollRevealProps {
  children: ReactNode;
  /** Direction the element slides in from (default: "up") */
  direction?: Direction;
  /** Animation delay in seconds */
  delay?: number;
  /** Animation duration in seconds (default: 0.5) */
  duration?: number;
  /** Viewport amount visible before triggering (0-1, default: 0.15) */
  threshold?: number;
  /** Whether the animation should only fire once (default: true) */
  once?: boolean;
  className?: string;
}

function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.5,
  threshold = 0.15,
  once = true,
  className,
}: ScrollRevealProps) {
  const offset = directionOffsets[direction];

  const variants: Variants = {
    hidden: {
      opacity: 0,
      x: offset.x,
      y: offset.y,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1], // cubic-bezier ease-out
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: threshold }}
      variants={variants}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

ScrollReveal.displayName = "ScrollReveal";

export { ScrollReveal };
