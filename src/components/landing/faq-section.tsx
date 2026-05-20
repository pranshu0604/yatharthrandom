"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeading from "./section-heading";

/* ------------------------------------------------------------------ */
/* FAQ Accordion — Shopify-style with animated plus/minus toggle       */
/* ------------------------------------------------------------------ */

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: "What is ReMemberX and how does it work?",
    answer:
      "ReMemberX is India's trusted marketplace for buying and selling transferable premium memberships — clubs, gyms, resorts, co-working spaces, holiday packages, and concert tickets. Transfer the membership or tickets after making sure the authenticity of the membership or the tickets. Sellers list their unused or transferable memberships, buyers browse and connect with verified sellers, and the membership transfer happens securely through our platform.",
  },
  {
    question: "How much can I save as a buyer?",
    answer:
      "Buyers typically save 30–70% off the original membership price. The exact savings depend on the membership type, remaining duration, and seller pricing. Every listing shows the original price and discount percentage upfront.",
  },
  {
    question: "What does it cost to list a membership?",
    answer:
      "Creating an account and listing your membership is free. ReMemberX does not charge any listing fees or commissions as of now.",
  },
  {
    question: "What types of memberships can I find?",
    answer:
      "You can find gym & fitness memberships, elite club memberships, resort & hotel memberships, holiday packages, sports clubs, pool & spa memberships, co-working spaces, and more — all from verified sellers across India.",
  },
];

function FaqAccordionItem({ item, index }: { item: FaqItem; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-neutral-800 last:border-b-0">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-4 py-6 text-left cursor-pointer group"
        aria-expanded={isOpen}
      >
        <h3 className="text-base sm:text-lg font-semibold text-white pr-4 group-hover:text-neutral-300 transition-colors">
          {item.question}
        </h3>

        {/* Animated plus/minus toggle */}
        <div
          className={`shrink-0 flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-colors duration-300 ${
            isOpen ? "bg-white" : "bg-neutral-800 group-hover:bg-neutral-700"
          }`}
        >
          <div className="relative w-4 h-4 sm:w-5 sm:h-5">
            {/* Horizontal bar (always visible) */}
            <span
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 block w-3.5 sm:w-4 h-0.5 rounded-full transition-colors duration-300 ${
                isOpen ? "bg-neutral-900" : "bg-white"
              }`}
            />
            {/* Vertical bar (rotates to 0 when open) */}
            <span
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 block w-3.5 sm:w-4 h-0.5 rounded-full transition-all duration-300 ${
                isOpen
                  ? "rotate-0 bg-neutral-900"
                  : "rotate-90 bg-white"
              }`}
            />
          </div>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-6 pr-16 text-sm sm:text-base text-neutral-400 leading-relaxed">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FaqSection() {
  return (
    <section className="py-20 sm:py-28 bg-neutral-950">
      <div className="max-w-3xl mx-auto px-6 sm:px-8 lg:px-12">
        <SectionHeading
          title="Questions?"
          className="mb-12"
        />

        <div>
          {faqs.map((faq, index) => (
            <FaqAccordionItem key={index} item={faq} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
