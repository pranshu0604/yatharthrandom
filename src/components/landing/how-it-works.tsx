"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Upload, Search, Handshake } from "lucide-react";
import SectionHeading from "@/components/landing/section-heading";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

const steps = [
  {
    icon: Upload,
    number: "01",
    title: "List or Browse",
    description:
      "Sellers create a listing in minutes. Buyers browse verified memberships across categories and cities.",
    color: "bg-accent/15",
    iconColor: "text-accent",
  },
  {
    icon: Search,
    number: "02",
    title: "Connect & Negotiate",
    description:
      "Find the perfect deal. Connect with verified sellers or buyers and agree on terms that work for both.",
    color: "bg-purple-500/10",
    iconColor: "text-purple-600",
  },
  {
    icon: Handshake,
    number: "03",
    title: "Transfer Securely",
    description:
      "Complete the membership transfer through our secure platform. Save up to 70% on premium memberships.",
    color: "bg-amber-500/10",
    iconColor: "text-amber-600",
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.8", "center 0.4"],
  });

  const lineWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={sectionRef} id="how-it-works" className="py-20 sm:py-28 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <SectionHeading
          title="How It Works"
          subtitle="Simple, secure, and seamless membership transfers"
          className="mb-16"
        />

        {/* Steps */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {/* Animated connector line (desktop only) */}
          <div className="hidden md:block absolute top-10 left-[16.67%] right-[16.67%] h-px">
            {/* Track */}
            <div className="absolute inset-0 bg-neutral-700 rounded-full" />
            {/* Animated fill */}
            <motion.div
              className="absolute inset-y-0 left-0 bg-linear-to-r from-accent via-purple-500 to-amber-500 rounded-full"
              style={{ width: lineWidth }}
            />
          </div>

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                className="relative text-center"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.15, ease }}
              >
                {/* Icon */}
                <div
                  className={`mx-auto flex items-center justify-center w-20 h-20 rounded-2xl ${step.color} border border-neutral-800 shadow-none mb-6`}
                >
                  <Icon className={`h-8 w-8 ${step.iconColor}`} />
                </div>

                {/* Step number */}
                <span className={`text-xs font-bold ${step.iconColor} tracking-widest uppercase`}>
                  Step {step.number}
                </span>

                {/* Title */}
                <h3 className="mt-2 text-xl font-bold text-white">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="mt-3 text-neutral-500 leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* CTAs */}
        <motion.div
          className="mt-16 flex items-center justify-center gap-4 flex-wrap"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.3, ease }}
        >
          <Link
            href="/dashboard/seller/listings/new"
            className="group inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-full bg-neutral-900 text-white hover:bg-neutral-800 hover:shadow-[0_0_20px_rgba(46,196,182,0.3)] transition-all duration-300"
          >
            Start Selling
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-full text-neutral-300 border border-neutral-700 hover:border-neutral-500 hover:bg-white/5 transition-all"
          >
            Browse Marketplace
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
