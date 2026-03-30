import { Suspense } from "react";
import Hero from "@/components/landing/hero";
import LogoBar from "@/components/landing/logo-bar";
import StatsBar from "@/components/landing/stats-bar";
import FeaturedListings from "@/components/landing/featured-listings";
import FeatureCards from "@/components/landing/feature-cards";
import Categories from "@/components/landing/categories";
import HowItWorks from "@/components/landing/how-it-works";
import Testimonial from "@/components/landing/testimonial";
import FaqSection from "@/components/landing/faq-section";
import CTASection from "@/components/landing/cta-section";
import StickyCta from "@/components/landing/sticky-cta";

/* ------------------------------------------------------------------ */
/* Skeletons — match actual component layouts                          */
/* ------------------------------------------------------------------ */
function FeaturedSkeleton() {
  return (
    <section className="py-24 sm:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Left-aligned heading skeleton */}
        <div className="mb-12 space-y-3">
          <div className="h-3 bg-neutral-200 w-20 animate-pulse" />
          <div className="h-9 bg-neutral-200 w-80 max-w-full animate-pulse" />
        </div>

        {/* Card grid — gap-px, no rounded corners */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-neutral-200">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="aspect-4/3 bg-neutral-100 animate-pulse" />
              <div className="px-4 py-4 space-y-3">
                <div className="h-2.5 bg-neutral-100 w-16 animate-pulse" />
                <div className="h-4 bg-neutral-200 w-4/5 animate-pulse" />
                <div className="flex justify-between">
                  <div className="h-3 bg-neutral-100 w-14 animate-pulse" />
                  <div className="h-3 bg-neutral-100 w-10 animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoriesSkeleton() {
  return (
    <section className="py-24 sm:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-14 space-y-4">
          <div className="h-9 bg-neutral-200 w-64 mx-auto animate-pulse" />
          <div className="h-4 bg-neutral-100 w-80 max-w-full mx-auto animate-pulse" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="border-l-2 border-neutral-200 bg-neutral-50 px-5 py-5 animate-pulse"
            >
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-neutral-200 shrink-0" />
                <div className="h-4 bg-neutral-200 w-24" />
              </div>
              <div className="mt-2 pl-8">
                <div className="h-3 bg-neutral-100 w-14" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Landing page                                                        */
/* ------------------------------------------------------------------ */
export default function Home() {
  return (
    <div className="-mt-16">
      <Hero />
      <LogoBar />
      <StatsBar />

      <Suspense fallback={<FeaturedSkeleton />}>
        <FeaturedListings />
      </Suspense>

      <FeatureCards />

      <Suspense fallback={<CategoriesSkeleton />}>
        <Categories />
      </Suspense>

      <HowItWorks />
      <Testimonial />
      <FaqSection />
      <CTASection />
      <StickyCta />
    </div>
  );
}
