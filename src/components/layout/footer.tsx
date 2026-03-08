import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Marketplace", href: "/marketplace" },
  { label: "Sell Membership", href: "/list" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const categories = [
  { label: "Club Memberships", href: "/marketplace?category=club" },
  { label: "Gym & Fitness", href: "/marketplace?category=gym-fitness" },
  { label: "Holiday Packages", href: "/marketplace?category=holiday" },
  { label: "Resort Memberships", href: "/marketplace?category=resort" },
];

export default function Footer() {
  return (
    <footer className="bg-neutral-950 border-t border-white/5 text-neutral-400">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8 lg:py-24">
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-1 pr-8">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <div className="h-8 w-8 bg-neutral-900 rounded-lg flex items-center justify-center text-neutral-950 font-bold text-lg">
                R
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                ReMember<span className="text-secondary">X</span>
              </span>
            </Link>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-neutral-400">
              India&apos;s trusted marketplace for buying and selling premium
              memberships. Access the exclusive.
            </p>

            <div className="mt-8 flex gap-4">
              {/* Social Icons - simplified */}
              {["Twitter", "Instagram", "LinkedIn"].map((social) => (
                <a
                  key={social}
                  href="#"
                  aria-label={social}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-900/5 text-neutral-400 transition-all duration-300 hover:bg-neutral-900 hover:text-black"
                >
                  <span className="sr-only">{social}</span>
                  <div className="h-4 w-4 bg-current rounded-sm" /> {/* Placeholder for icon */}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-6">
              Platform
            </h3>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-neutral-400 transition-colors duration-200 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-6">
              Discover
            </h3>
            <ul className="space-y-4">
              {categories.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-neutral-400 transition-colors duration-200 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-6">
              Contact
            </h3>
            <ul className="space-y-4">
              <li>
                <a href="mailto:hello@rememberx.in" className="flex items-start gap-3 text-sm text-neutral-400 transition-colors duration-200 hover:text-white">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 opacity-50" />
                  hello@rememberx.in
                </a>
              </li>
              <li>
                <span className="flex items-start gap-3 text-sm text-neutral-400">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 opacity-50" />
                  Mumbai, India
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-6 border-t border-white/5 py-8 sm:flex-row">
          <p className="text-xs text-neutral-500">
            &copy; {new Date().getFullYear()} ReMemberX. All rights reserved.
          </p>
          <div className="flex gap-8">
            <Link href="/privacy" className="text-xs text-neutral-500 transition-colors duration-200 hover:text-neutral-300">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-neutral-500 transition-colors duration-200 hover:text-neutral-300">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
