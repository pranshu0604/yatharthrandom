"use client";

import { useEffect, useRef } from "react";

/* ------------------------------------------------------------------ */
/* Animated gradient mesh background — canvas-based                    */
/* Creates a living, breathing backdrop without needing video files.    */
/* Renders drifting color orbs with smooth noise-like movement.         */
/* ------------------------------------------------------------------ */

interface Orb {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

const ORB_CONFIGS = [
  { color: "rgba(27, 31, 59, 0.7)", radiusMin: 0.25, radiusMax: 0.4 },   // indigo
  { color: "rgba(212, 175, 55, 0.25)", radiusMin: 0.2, radiusMax: 0.35 }, // gold
  { color: "rgba(46, 196, 182, 0.18)", radiusMin: 0.18, radiusMax: 0.3 }, // teal
  { color: "rgba(27, 31, 59, 0.5)", radiusMin: 0.22, radiusMax: 0.38 },   // indigo 2
  { color: "rgba(212, 175, 55, 0.12)", radiusMin: 0.15, radiusMax: 0.28 }, // gold dim
];

function createOrbs(w: number, h: number): Orb[] {
  const size = Math.max(w, h);
  return ORB_CONFIGS.map((cfg) => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    radius: size * (cfg.radiusMin + Math.random() * (cfg.radiusMax - cfg.radiusMin)),
    color: cfg.color,
  }));
}

export default function HeroBgCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const orbsRef = useRef<Orb[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio, 2);
      // Use lower resolution for performance (0.5x)
      const scale = 0.5 * dpr;
      canvas!.width = window.innerWidth * scale;
      canvas!.height = window.innerHeight * scale;
      canvas!.style.width = "100%";
      canvas!.style.height = "100%";
      orbsRef.current = createOrbs(canvas!.width, canvas!.height);
    }

    resize();
    window.addEventListener("resize", resize);

    function draw() {
      if (!ctx || !canvas) return;
      const w = canvas.width;
      const h = canvas.height;

      // Clear to black
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, w, h);

      // Draw each orb as a radial gradient circle
      for (const orb of orbsRef.current) {
        // Move
        if (!prefersReducedMotion) {
          orb.x += orb.vx;
          orb.y += orb.vy;

          // Soft bounce off edges
          if (orb.x < -orb.radius * 0.5) orb.vx = Math.abs(orb.vx);
          if (orb.x > w + orb.radius * 0.5) orb.vx = -Math.abs(orb.vx);
          if (orb.y < -orb.radius * 0.5) orb.vy = Math.abs(orb.vy);
          if (orb.y > h + orb.radius * 0.5) orb.vy = -Math.abs(orb.vy);
        }

        const grad = ctx.createRadialGradient(
          orb.x,
          orb.y,
          0,
          orb.x,
          orb.y,
          orb.radius
        );
        grad.addColorStop(0, orb.color);
        grad.addColorStop(1, "rgba(0,0,0,0)");

        ctx.fillStyle = grad;
        ctx.fillRect(
          orb.x - orb.radius,
          orb.y - orb.radius,
          orb.radius * 2,
          orb.radius * 2
        );
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
    />
  );
}
