"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, LogOut, LayoutDashboard, User } from "lucide-react";
import { cn, getInitials } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Marketplace", href: "/marketplace" },
  { label: "How It Works", href: "/#how-it-works" },
];

function subscribeToScroll(callback: () => void) {
  window.addEventListener("scroll", callback, { passive: true });
  return () => window.removeEventListener("scroll", callback);
}

function getScrollSnapshot() {
  return window.scrollY > 10;
}

function getServerScrollSnapshot() {
  return false;
}

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const scrolled = useSyncExternalStore(subscribeToScroll, getScrollSnapshot, getServerScrollSnapshot);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const dashboardHref = session?.user?.role === "ADMIN" ? "/admin" : "/dashboard";

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-white/95 backdrop-blur-sm shadow-[0_1px_3px_rgba(0,0,0,0.05),0_4px_12px_rgba(0,0,0,0.03)] border-b border-neutral-100"
            : "bg-white border-b border-transparent"
        )}
      >
        <nav className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="relative z-10 flex items-center gap-0.5">
              <span className="text-[22px] font-bold tracking-tight text-neutral-900">
                ReMember
              </span>
              <span className="text-[22px] font-bold tracking-tight text-accent">
                X
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden items-center gap-1 lg:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-4 py-2 text-[15px] font-medium transition-colors duration-200",
                    pathname === link.href
                      ? "text-neutral-900"
                      : "text-neutral-500 hover:text-neutral-900"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop Right Side */}
            <div className="hidden items-center gap-3 lg:flex">
              {session ? (
                <>
                  <Link
                    href={dashboardHref}
                    className="flex items-center gap-2 px-4 py-2 text-[15px] font-medium text-neutral-500 hover:text-neutral-900 transition-colors duration-200"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>

                  {/* Profile Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setProfileOpen(!profileOpen)}
                      className="relative flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900 text-xs font-semibold text-white transition-shadow hover:shadow-md overflow-hidden"
                    >
                      {session.user?.image ? (
                        <Image
                          src={session.user.image}
                          alt={session.user?.name || "Profile"}
                          fill
                          className="rounded-full object-cover"
                          sizes="36px"
                          unoptimized
                        />
                      ) : (
                        getInitials(session.user?.name || "U")
                      )}
                    </button>

                    <AnimatePresence>
                      {profileOpen && (
                        <>
                          <div
                            className="fixed inset-0 z-40"
                            onClick={() => setProfileOpen(false)}
                          />
                          <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 top-12 z-50 w-56 rounded-xl border border-neutral-200 bg-white py-2 shadow-lg"
                          >
                            <div className="border-b border-neutral-100 px-4 py-3">
                              <p className="text-sm font-semibold text-neutral-800">
                                {session.user?.name}
                              </p>
                              <p className="text-xs text-neutral-500">
                                {session.user?.email}
                              </p>
                            </div>
                            <Link
                              href={dashboardHref}
                              onClick={() => setProfileOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-neutral-900"
                            >
                              <LayoutDashboard className="h-4 w-4" />
                              Dashboard
                            </Link>
                            <button
                              onClick={() => signOut({ callbackUrl: "/" })}
                              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-error"
                            >
                              <LogOut className="h-4 w-4" />
                              Sign Out
                            </button>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-2 text-[15px] font-medium text-neutral-500 hover:text-neutral-900 transition-colors duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 text-[15px] font-medium text-neutral-500 hover:text-neutral-900 transition-colors duration-200"
                  >
                    Sign Up
                  </Link>
                </>
              )}
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ delay: 2, duration: 0.6, ease: "easeInOut" }}
              >
                <Link
                  href="/dashboard/seller/listings/new"
                  className="group inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[14px] font-semibold text-white bg-neutral-900 hover:bg-neutral-800 hover:shadow-[0_0_20px_rgba(46,196,182,0.3)] transition-all duration-300"
                >
                  List Your Membership
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              </motion.div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="relative z-10 flex h-10 w-10 items-center justify-center rounded-lg text-neutral-700 hover:bg-neutral-100 transition-colors lg:hidden"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ opacity: 0, rotate: 90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: -90 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Menu className="h-5 w-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 z-40 flex h-full w-[85%] max-w-sm flex-col bg-white shadow-[-8px_0_30px_rgba(0,0,0,0.08)]"
            >
              <div className="h-16 shrink-0" />

              <div className="flex flex-1 flex-col overflow-y-auto px-6 pb-8">
                <div className="space-y-1 pt-2">
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + i * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center rounded-xl px-4 py-3.5 text-[16px] font-medium text-neutral-700 transition-colors hover:bg-neutral-50 hover:text-neutral-900"
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                <div className="my-5 h-px bg-neutral-100" />

                <div className="space-y-1">
                  {session ? (
                    <>
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Link
                          href={dashboardHref}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-[16px] font-medium text-neutral-700 transition-colors hover:bg-neutral-50 hover:text-neutral-900"
                        >
                          <LayoutDashboard className="h-5 w-5" />
                          Dashboard
                        </Link>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25 }}
                      >
                        <button
                          onClick={() => {
                            setIsOpen(false);
                            signOut({ callbackUrl: "/" });
                          }}
                          className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-[16px] font-medium text-neutral-700 transition-colors hover:bg-neutral-50 hover:text-error"
                        >
                          <LogOut className="h-5 w-5" />
                          Sign Out
                        </button>
                      </motion.div>
                    </>
                  ) : (
                    <>
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Link
                          href="/login"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-[16px] font-medium text-neutral-700 transition-colors hover:bg-neutral-50 hover:text-neutral-900"
                        >
                          <User className="h-5 w-5" />
                          Login
                        </Link>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25 }}
                      >
                        <Link
                          href="/register"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-[16px] font-medium text-neutral-700 transition-colors hover:bg-neutral-50 hover:text-neutral-900"
                        >
                          <User className="h-5 w-5" />
                          Sign Up
                        </Link>
                      </motion.div>
                    </>
                  )}
                </div>

                <div className="mt-auto pt-6">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Link
                      href="/dashboard/seller/listings/new"
                      onClick={() => setIsOpen(false)}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 px-5 py-3.5 text-[15px] font-semibold text-white transition-colors duration-200 hover:bg-neutral-800"
                    >
                      List Your Membership
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
