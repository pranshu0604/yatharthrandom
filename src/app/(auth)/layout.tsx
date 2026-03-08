import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ReMemberX — Sign In or Create Account",
  description:
    "Access your ReMemberX account to buy and sell premium memberships.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* ---------------------------------------------------------------- */}
      {/* Left decorative panel -- hidden on mobile                        */}
      {/* ---------------------------------------------------------------- */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] bg-neutral-950 relative overflow-hidden flex-col justify-between p-12 border-r border-neutral-800">
        {/* Decorative pattern overlay */}
        <div className="absolute inset-0 opacity-[0.04]">
          <svg
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="auth-grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#auth-grid)" />
          </svg>
        </div>

        {/* Decorative gradient blobs */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-accent/15 blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 rounded-full bg-secondary/15 blur-3xl" />

        {/* Top content */}
        <div className="relative z-10">
          <Link href="/" className="inline-block">
            <span className="text-2xl font-bold text-white tracking-tight">
              ReMember<span className="text-accent">X</span>
            </span>
          </Link>
        </div>

        {/* Center content */}
        <div className="relative z-10 max-w-md">
          <h1 className="font-serif text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
            Buy &amp; Sell Premium Memberships
          </h1>
          <p className="text-lg text-neutral-500 leading-relaxed">
            India&apos;s trusted marketplace for club, gym, resort, and
            holiday memberships. Join thousands who have already saved
            big on premium memberships.
          </p>

          {/* Trust indicators */}
          <div className="mt-10 flex items-center gap-8">
            <div>
              <p className="text-3xl font-bold text-white">5,000+</p>
              <p className="text-sm text-neutral-400 mt-1">Active Listings</p>
            </div>
            <div className="w-px h-12 bg-neutral-700" />
            <div>
              <p className="text-3xl font-bold text-white">10,000+</p>
              <p className="text-sm text-neutral-400 mt-1">Happy Members</p>
            </div>
            <div className="w-px h-12 bg-neutral-700" />
            <div>
              <p className="text-3xl font-bold text-white">98%</p>
              <p className="text-sm text-neutral-400 mt-1">Satisfaction</p>
            </div>
          </div>
        </div>

        {/* Bottom content */}
        <div className="relative z-10">
          <p className="text-sm text-neutral-400">
            &copy; {new Date().getFullYear()} ReMemberX. All rights reserved.
          </p>
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Right panel -- form area                                          */}
      {/* ---------------------------------------------------------------- */}
      <div className="flex-1 flex flex-col bg-[#050505]">
        {/* Mobile logo bar */}
        <div className="lg:hidden flex items-center justify-between px-6 py-4 border-b border-neutral-800">
          <Link href="/">
            <span className="text-xl font-bold text-white tracking-tight">
              ReMember<span className="text-accent">X</span>
            </span>
          </Link>
        </div>

        {/* Form content */}
        <div className="flex-1 flex items-center justify-center px-6 py-12 sm:px-12">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}
