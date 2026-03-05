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
    <footer className="bg-neutral-50 border-t border-neutral-200 text-neutral-600">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8 lg:py-20">
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-0.5">
              <span className="text-[22px] font-bold tracking-tight text-neutral-900">
                ReMember
              </span>
              <span className="text-[22px] font-bold tracking-tight text-accent">
                X
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-neutral-500">
              India&apos;s trusted marketplace for buying and selling premium
              memberships. Give your membership a second life.
            </p>

            <div className="mt-6 flex gap-3">
              <a
                href="#"
                aria-label="Twitter"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100 text-neutral-500 transition-all duration-200 hover:bg-neutral-200 hover:text-neutral-700"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100 text-neutral-500 transition-all duration-200 hover:bg-neutral-200 hover:text-neutral-700"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100 text-neutral-500 transition-all duration-200 hover:bg-neutral-200 hover:text-neutral-700"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[13px] font-semibold uppercase tracking-wider text-neutral-400">
              Quick Links
            </h3>
            <ul className="mt-5 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[15px] text-neutral-500 transition-colors duration-200 hover:text-neutral-900">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-[13px] font-semibold uppercase tracking-wider text-neutral-400">
              Categories
            </h3>
            <ul className="mt-5 space-y-3">
              {categories.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[15px] text-neutral-500 transition-colors duration-200 hover:text-neutral-900">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-[13px] font-semibold uppercase tracking-wider text-neutral-400">
              Contact
            </h3>
            <ul className="mt-5 space-y-4">
              <li>
                <a href="mailto:hello@rememberx.in" className="flex items-start gap-3 text-[15px] text-neutral-500 transition-colors duration-200 hover:text-neutral-900">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400" />
                  hello@rememberx.in
                </a>
              </li>
              <li>
                <a href="tel:+911234567890" className="flex items-start gap-3 text-[15px] text-neutral-500 transition-colors duration-200 hover:text-neutral-900">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400" />
                  +91 12345 67890
                </a>
              </li>
              <li>
                <span className="flex items-start gap-3 text-[15px] text-neutral-500">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400" />
                  Mumbai, India
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-neutral-200 py-6 sm:flex-row">
          <p className="text-[13px] text-neutral-400">
            &copy; {new Date().getFullYear()} ReMemberX. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-[13px] text-neutral-400 transition-colors duration-200 hover:text-neutral-600">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-[13px] text-neutral-400 transition-colors duration-200 hover:text-neutral-600">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
