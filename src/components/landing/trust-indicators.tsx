"use client";

import { ShieldCheck, Lock, Tag, Users, type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import SectionHeading from "./section-heading";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

interface TrustItem {
  icon: LucideIcon;
  stat: string;
  title: string;
  description: string;
}

const trustItems: TrustItem[] = [
  {
    icon: ShieldCheck,
    stat: "500+",
    title: "Verified Sellers",
    description: "Every seller is KYC-verified before they can list.",
  },
  {
    icon: Lock,
    stat: "100%",
    title: "Secure Transfers",
    description: "End-to-end secure membership transfers.",
  },
  {
    icon: Tag,
    stat: "70%",
    title: "Save Up To",
    description: "On premium memberships. No hidden fees.",
  },
  {
    icon: Users,
    stat: "5,000+",
    title: "Members",
    description: "A growing community across India.",
  },
];

export default function TrustIndicators() {
  return (
    <section className="py-24 sm:py-32 bg-neutral-900">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <SectionHeading
          title="Why ReMemberX"
          subtitle="Built on trust, security, and savings"
          className="mb-16"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                className="rounded-2xl border border-neutral-800 bg-neutral-900 p-8 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.1, ease }}
              >
                {/* Icon */}
                <div className="mx-auto w-14 h-14 rounded-xl bg-accent/15 flex items-center justify-center mb-6">
                  <Icon className="h-7 w-7 text-accent" />
                </div>

                {/* Stat */}
                <p className="text-4xl font-bold text-white">
                  {item.stat}
                </p>

                {/* Title */}
                <h3 className="mt-1.5 text-sm font-semibold tracking-wide text-neutral-400 uppercase">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="mt-3 text-sm text-neutral-500 leading-relaxed max-w-55 mx-auto">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
