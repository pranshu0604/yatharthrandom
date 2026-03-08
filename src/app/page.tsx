import { Suspense } from "react";
import Hero from "@/components/landing/hero";
import StatsBar from "@/components/landing/stats-bar";
import FeaturedListings from "@/components/landing/featured-listings";
import Categories from "@/components/landing/categories";
import HowItWorks from "@/components/landing/how-it-works";
import TrustIndicators from "@/components/landing/trust-indicators";
import CTASection from "@/components/landing/cta-section";

function SectionSkeleton() {
  return (
    <div className="py-20 sm:py-24 bg-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-neutral-800 rounded w-64 mx-auto" />
          <div className="h-1 bg-neutral-800 rounded w-16 mx-auto" />
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-72 bg-neutral-950 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="-mt-16">
      <Hero />

      <StatsBar />

      <Suspense fallback={<SectionSkeleton />}>
        <FeaturedListings />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <Categories />
      </Suspense>

      <HowItWorks />

      <TrustIndicators />

      <CTASection />
    </div>
  );
}
